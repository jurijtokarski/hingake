import { FunctionComponent, h } from "preact";
import { useContext } from "preact/hooks";

import { Context } from "../context";
import { getScaleByStepProgress } from "../utils";

import "./index.css";

const Animation: FunctionComponent = () => {
  const { isActive, step, progress, start, stop } = useContext(Context);

  const style = {
    transform: `scale(${getScaleByStepProgress(step, progress) + 1})`
  };

  const onClick = isActive ? stop : start;
  const label = isActive ? "Stop" : "Start";

  return (
    <button className="animation" onClick={onClick} style={style}>
      {label}
    </button>
  );
};

export default Animation;
