import { FunctionComponent, h } from "preact";
import { useContext } from "preact/hooks";

import { Context, Step } from "../context";

import "./index.css";

const Animation: FunctionComponent = () => {
  const { isActive, step, progress, start, stop } = useContext(Context);

  const getScale = () => {
    if (step === Step.PAUSE) {
      return 1;
    }

    if (step == Step.WAIT) {
      return 1.5;
    }

    if (step === Step.EXHALE) {
      return 1.5 - 0.5 * progress;
    }

    return 1 + 0.5 * progress;
  };

  const style = { transform: `scale(${getScale()})` };

  return (
    <div className="animation" style={style}>
      {isActive ? (
        <button onClick={stop}>Stop</button>
      ) : (
        <button onClick={start}>Start</button>
      )}
    </div>
  );
};

export default Animation;
