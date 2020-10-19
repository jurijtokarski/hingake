import { FunctionComponent, h } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

import { Context } from "../context";
import { getScaleByStepProgress } from "../utils";

import "./index.css";

const Animation: FunctionComponent = () => {
  const { step, progress } = useContext(Context);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const size = `${(getScaleByStepProgress(step, progress) + 1) * 7}rem`;

  const style = {
    width: size,
    height: size
  };

  return (
    <div
      className={`animation ${
        isVisible ? "animation--visible" : "animation--hidden"
      }`}
      style={style}
    />
  );
};

export default Animation;
