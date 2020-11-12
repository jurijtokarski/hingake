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
  setAudioStatus
} from "./utils";

import Background from "./Background";
import Animation from "./Animation";
import Info from "./Info";
import Button from "./Button";
import Header from "./Header";
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
    this.media.resetAll();
    this.deinitializeKeyPress();
  }

  isMounted = () => this._mounted;

  setMounted = (value: boolean) => (this._mounted = value);

  checkAudioStatus = () => {
    const audioStatus = Boolean(getAudioStatus() || 0);

    if (audioStatus) {
      this.setAudioStatus(true);
    }
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

  initializeKeyPress = () => {
    document.addEventListener("keypress", this.handleKeypress);
  };

  deinitializeKeyPress = () => {
    document.removeEventListener("keypress", this.handleKeypress);
  };

  handleKeypress = (e: KeyboardEvent) => {
    if (e.which !== 32) {
      // 32 is space
      return;
    }

    if (this.state.state === State.ACTIVE) {
      return this.handleStop();
    }

    return this.handleStart();
  };

  requestAnimationFrame = (fn: FrameRequestCallback) =>
    window.requestAnimationFrame(fn) || setTimeout(fn, 1000 / 60);

  handleStop = () => {
    this.setState(
      {
        ...DEFAULT_CONTEXT_VALUES,
        state: State.POST_ACTIVE,
        activationTime: this.state.activationTime
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
              activationTime: Date.now()
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
  };

  render() {
    return (
      <Context.Provider value={this.state}>
        <Background>
          <Fragment>
            <Header />
            <Content>
              <Fragment>
                <Info />
                <Animation />
                <Button />
              </Fragment>
            </Content>
          </Fragment>
        </Background>
      </Context.Provider>
    );
  }
}

export default App;
