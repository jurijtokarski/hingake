import { FunctionComponent, h, Fragment } from "preact";
import { useContext } from "preact/hooks";

import { Context } from "../context";
import { getScaleByStepProgress } from "../utils";

import "./index.css";

const Animation: FunctionComponent = () => {
  const { isActive, step, progress, start, stop } = useContext(Context);

  const size = `${(getScaleByStepProgress(step, progress) + 1) * 7}rem`;

  const style = {
    width: size,
    height: size
  };

  const onClick = isActive ? stop : start;
  const label = isActive ? "Stop" : "Start";

  return <div className="animation" style={style} />;
};

export default Animation;
