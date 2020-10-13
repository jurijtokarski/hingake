import { FunctionComponent, h, Fragment } from "preact";
import { useContext } from "preact/hooks";

import { Context } from "../context";
import { getScaleByStepProgress } from "../utils";

import "./index.css";

const Button: FunctionComponent = () => {
  const { isActive, step, progress, start, stop } = useContext(Context);

  const style = {
    transform: `scale(${getScaleByStepProgress(step, progress) + 1})`
  };

  const onClick = isActive ? stop : start;
  const label = isActive ? "Stop" : "Start";

  return (
    <button className="button" onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
