import { FunctionComponent, h } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

import { Context } from "../context";

import "./index.css";

const Button: FunctionComponent = () => {
  const { isActive, start, stop } = useContext(Context);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 200);
  }, []);

  const onClick = isActive ? stop : start;
  const label = isActive ? "Stop" : "Start";

  return (
    <button
      className={`button ${isVisible ? "button--visible" : "button--hidden"} ${
        isActive ? "button--active" : "button--inactive"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
