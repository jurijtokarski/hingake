import { round } from "@jurijtokarski/calc";
import { FunctionComponent, h } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

import { Context } from "../context";
import { getScaleByStepProgress } from "../utils";

import "./index.css";

const Animation: FunctionComponent = () => {
  const { step, progress, isActive } = useContext(Context);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const scale = round((getScaleByStepProgress(step, progress) + 1.5) * 7, 4);
  const size = `${scale}rem`;

  const style = {
    width: size,
    height: size
  };

  const parts = [];

  for (let i = 0; i < 360; i += 30) {
    parts.push(<use href="#petal" transform={`rotate(${i} 50 50)`} />);
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className={`animation ${
        isVisible ? "animation--visible" : "animation--hidden"
      } ${isActive ? "animation--active" : "animation--inactive"}`}
      style={style}
    >
      <defs>
        <path
          d="M50 5.9c13.6 5.9 21.4 32.9 0 44.1-20.5-10.7-15-38 0-44.1z"
          id="petal"
        />
      </defs>
      {parts}
    </svg>
  );
};

export default Animation;
