import { Component, Fragment, h } from "preact";

import {
  DEFAULT_CONTEXT_VALUES,
  Context,
  ModeConfig,
  Step,
  AppContext,
  State,
  PRE_ACTIVE_DELAY
} from "./context";

import {
  getAudioStatus,
  getRunCount,
  setRunCount,
  Media,
  setAudioStatus,
  isServer
} from "./utils";

import Background from "./Background";
import Animation from "./Animation";
import Info from "./Info";
import Buttons from "./Buttons";
import TopBar from "./TopBar";
import Content from "./Content";

class App extends Component<{}, AppContext> {
  private _mounted = false;
  private _wakeLock = null;

  private media = new Media();

  constructor() {
    super();

    this.state = {
      ...DEFAULT_CONTEXT_VALUES,
      start: this.handleStart,
      stop: this.handleStop,
      toggleAudioStatus: this.toggleAudioStatus
    };
  }

  componentDidMount() {
    this.setMounted(true);
    this.checkAudioStatus();
  }

  componentWillUnmount() {
    this.setMounted(false);
  }

  isMounted = () => this._mounted;

  setMounted = (value: boolean) => (this._mounted = value);

  checkAudioStatus = () => {
    const audioStatus = Boolean(getAudioStatus() || 0);

    if (audioStatus) {
      this.setAudioStatus(true);
    }

    // Fix for Safari: play/pause audio to unlock them for future usage
    this.unlockAudio();
  };

  unlockAudio = () => {
    if (isServer()) {
      return;
    }

    const unlockListener = () => {
      this.media.unlock();
      document.body.removeEventListener("click", unlockListener);
    };

    document.body.addEventListener("click", unlockListener);
    document.body.addEventListener("touchstart", unlockListener);
  };

  setAudioStatus = (isAudioEnabled: boolean) =>
    this.setState(
      {
        isAudioEnabled
      },
      () => {
        this.media.setEnabled(isAudioEnabled);
        setAudioStatus(Number(isAudioEnabled));
      }
    );

  toggleAudioStatus = () => this.setAudioStatus(!this.state.isAudioEnabled);

  requestAnimationFrame = (fn: FrameRequestCallback) =>
    window.requestAnimationFrame(fn) || setTimeout(fn, 1000 / 60);

  handleStop = () => {
    this.setState(
      {
        ...DEFAULT_CONTEXT_VALUES,
        state: State.POST_ACTIVE,
        isAudioEnabled: this.state.isAudioEnabled,
        activationTime: this.state.activationTime,
        count: this.state.count
      },
      () => {
        this.releaseWakeLock();
        this.media.resetAll();
      }
    );
  };

  handleStart = () =>
    this.setState(
      {
        state: State.PRE_ACTIVE
      },
      () =>
        setTimeout(() => {
          this.setState(
            {
              state: State.ACTIVE,
              activationTime: Date.now(),
              count: 0
            },
            this.nextFrame
          );
          this.initWakeLock();
          this.increaseRunCount();
        }, PRE_ACTIVE_DELAY)
    );

  increaseRunCount = () => setRunCount(getRunCount() + 1);

  initWakeLock = async () => {
    // @todo: remove @ts-ignore: wakeLock is a new API and now doesn't present in lib.dom.d.ts)

    if ("wakeLock" in navigator) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        this._wakeLock = await window.navigator.wakeLock?.request("screen");
      } catch {
        this._wakeLock = null;
      }
    }
  };

  releaseWakeLock = () => {
    // @todo: remove @ts-ignore: wakeLock is a new API and now doesn't present in lib.dom.d.ts)

    if (this._wakeLock) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        this.wakeLock.release().then(() => {
          this._wakeLock = null;
        });
      } catch {
        this._wakeLock = null;
      }
    }
  };

  nextFrame = () => this.requestAnimationFrame(this.checkFrame);

  isPossibleToUpdateFrame = () =>
    this.isMounted() &&
    this.state.state === State.ACTIVE &&
    this.state.activationTime > 0;

  getNextStepByPrevious = (step: Step) => {
    if (step === Step.PAUSE) {
      return Step.INHALE;
    }

    if (step === Step.INHALE) {
      return Step.WAIT;
    }

    if (step === Step.WAIT) {
      return Step.EXHALE;
    }

    return Step.PAUSE;
  };

  getNextStepFromCurrent = () => {
    return this.getNextStepByPrevious(this.state.step);
  };

  checkFrame = () => {
    if (!this.isPossibleToUpdateFrame()) {
      return;
    }

    const timeDiffInSeconds = (Date.now() - this.state.startTime) / 1000;
    const stepTimeInSeconds = ModeConfig[this.state.mode][this.state.step];
    const shouldChangeStep = timeDiffInSeconds >= stepTimeInSeconds;

    const calculatedStep = shouldChangeStep
      ? this.getNextStepFromCurrent()
      : this.state.step;

    // Skip step, if his duration is 0
    const step = ModeConfig[this.state.mode][calculatedStep]
      ? calculatedStep
      : this.getNextStepByPrevious(calculatedStep);

    const progress = shouldChangeStep
      ? 0
      : timeDiffInSeconds / stepTimeInSeconds;

    const startTime = shouldChangeStep ? Date.now() : this.state.startTime;
    const frame = shouldChangeStep ? 0 : this.state.frame + 1;

    if (shouldChangeStep) {
      this.handleStepChange(step);
    }

    this.setState(
      {
        step,
        startTime,
        progress,
        frame
      },
      this.nextFrame
    );
  };

  getNextStepVibrationDuration = (newStep: Step) => {
    if (newStep === Step.PAUSE || newStep === Step.WAIT) {
      return 50;
    }

    return 150;
  };

  handleStepChange = (newStep: Step) => {
    if ("vibrate" in navigator) {
      window.navigator.vibrate(this.getNextStepVibrationDuration(newStep));
    }

    this.media.setStepAndPlay(newStep);

    if (newStep === Step.INHALE) {
      this.setState({
        count: this.state.count + 1
      });
    }

    if (newStep === Step.INHALE && this.state.isAudioEnabled) {
      this.setAudioStatus(true);
    }
  };

  render() {
    return (
      <Context.Provider value={this.state}>
        <Background>
          <Fragment>
            <TopBar />
            <Content>
              <Fragment>
                <Info />
                <Animation />
                <Buttons />
              </Fragment>
            </Content>
          </Fragment>
        </Background>
      </Context.Provider>
    );
  }
}

export default App;
