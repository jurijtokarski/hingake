import { FunctionComponent, h } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

import { Context, State } from "../context";

import "./index.css";

const Button: FunctionComponent = () => {
  const { state, start, stop } = useContext(Context);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 200);
  }, []);

  const isActive = state === State.ACTIVE || state === State.PRE_ACTIVE;
  const onClick = isActive ? stop : start;
  const label = isActive ? "Stop" : "Start";

  return (
    <button
      className={`button button--${state.toLowerCase()} ${
        isVisible ? "button--visible" : "button--hidden"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
