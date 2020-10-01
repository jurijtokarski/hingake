import { FunctionComponent, h } from "preact";
import { useContext } from "preact/hooks";

import { Context } from "../context";
import { getScaleByStepProgress } from "../utils";

import "./index.css";

interface BackgroundProps {
  children: JSX.Element;
}

const Background: FunctionComponent<BackgroundProps> = ({ children }) => {
  const { step, progress } = useContext(Context);

  const backgroundSize = `${100 +
    20 * getScaleByStepProgress(step, progress)}%`;

  const style = {
    backgroundSize: `${backgroundSize} ${backgroundSize}`
  };

  return (
    <div className="background" style={style}>
      {children}
    </div>
  );
};

export default Background;
