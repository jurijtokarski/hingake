import { Component, Fragment, h } from "preact";

import {
  DEFAULT_CONTEXT_VALUES,
  Context,
  ModeConfig,
  Step,
  AppContext
} from "./context";

import Background from "./Background";
import Animation from "./Animation";
import Timer from "./Timer";
import Button from "./Button";
import Header from "./Header";
import Content from "./Content";
import Meta from "./Meta";

class App extends Component<{}, AppContext> {
  private __mounted = false;
  private __wakeLock = null;

  constructor() {
    super();

    this.state = {
      ...DEFAULT_CONTEXT_VALUES,
      start: this.handleStart,
      stop: this.handleStop
    };
  }

  componentDidMount() {
    this.__mounted = true;
    this.initializeKeyPress();
  }

  componentWillUnmount() {
    this.__mounted = false;
    this.deinitializeKeyPress();
  }

  isMounted = () => this.__mounted;

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

    if (this.state.isActive) {
      return this.handleStop();
    }

    return this.handleStart();
  };

  requestAnimationFrame = (fn: FrameRequestCallback) =>
    window.requestAnimationFrame(fn) || setTimeout(fn, 1000 / 60);

  handleStop = () => {
    this.setState(DEFAULT_CONTEXT_VALUES);
    this.releaseWakeLock();
  };

  handleStart = () => {
    this.setState(
      {
        isActive: true,
        activationTime: Date.now()
      },
      this.nextFrame
    );
    this.initWakeLock();
  };

  initWakeLock = async () => {
    // @todo: remove @ts-ignore: wakeLock is a new API and now doesn't present in lib.dom.d.ts)

    if ("wakeLock" in navigator) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        this.__wakeLock = await window.navigator.wakeLock?.request("screen");
      } catch {
        this.__wakeLock = null;
      }
    }
  };

  releaseWakeLock = () => {
    // @todo: remove @ts-ignore: wakeLock is a new API and now doesn't present in lib.dom.d.ts)

    if (this.__wakeLock) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        this.__wakeLock.release().then(() => {
          this.__wakeLock = null;
        });
      } catch {
        this.__wakeLock = null;
      }
    }
  };

  nextFrame = () => this.requestAnimationFrame(this.checkFrame);

  isPossibleToUpdateFrame = () =>
    this.isMounted() && this.state.isActive && this.state.activationTime > 0;

  getNextStepFromCurrent = () => {
    const { step } = this.state;

    if (step === Step.PAUSE) {
      return Step.INHALE;
    }

    if (step === Step.INHALE) {
      return Step.WAIT;
    }

    if (step === Step.WAIT) {
      return Step.EXHALE;
    }

    if (step === Step.EXHALE) {
      return Step.PAUSE;
    }
  };

  checkFrame = () => {
    if (!this.isPossibleToUpdateFrame()) {
      return;
    }

    const timeDiffInSeconds = (Date.now() - this.state.startTime) / 1000;
    const stepTimeInSeconds = ModeConfig[this.state.mode][this.state.step];
    const shouldChangeStep = timeDiffInSeconds >= stepTimeInSeconds;

    const step = shouldChangeStep
      ? this.getNextStepFromCurrent()
      : this.state.step;
    const startTime = shouldChangeStep ? Date.now() : this.state.startTime;
    const progress = shouldChangeStep
      ? 0
      : timeDiffInSeconds / stepTimeInSeconds;
    const frame = shouldChangeStep ? 0 : this.state.frame + 1;

    if (shouldChangeStep) {
      this.handleStepChange();
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

  handleStepChange = () => {
    if ("vibrate" in navigator) {
      window.navigator.vibrate(50);
    }
  };

  render() {
    return (
      <Context.Provider value={this.state}>
        <Meta />
        <Background>
          <Fragment>
            <Header />
            <Content>
              <Fragment>
                <Timer />
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
