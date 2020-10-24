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
  }

  componentWillUnmount() {
    this.__mounted = false;
  }

  isMounted = () => this.__mounted;

  requestAnimationFrame = (fn: FrameRequestCallback) =>
    window.requestAnimationFrame(fn) || setTimeout(fn, 1000 / 60);

  handleStop = () => this.setState(DEFAULT_CONTEXT_VALUES);

  handleStart = () =>
    this.setState(
      {
        isActive: true,
        activationTime: Date.now()
      },
      this.nextFrame
    );

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
