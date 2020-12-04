import { FunctionComponent, h } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

import { Context, State } from "../context";

import "./index.css";

const Buttons: FunctionComponent = () => {
  const { state, start, stop, isAudioEnabled, toggleAudioStatus } = useContext(
    Context
  );
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 200);
  }, []);

  const isActive = state === State.ACTIVE || state === State.PRE_ACTIVE;
  const onClick = isActive ? stop : start;
  const label = isActive ? "Stop" : "Start";

  return (
    <div className="buttons">
      <span className="mock" />

      <button
        className={`button button--${state.toLowerCase()} ${
          isVisible ? "button--visible" : "button--hidden"
        }`}
        onClick={onClick}
      >
        {label}
      </button>
      <button
        className={`button button--small ${
          isAudioEnabled ? "button--enabled" : "button--disabled"
        } ${isVisible ? "button--visible" : "button--hidden"}`}
        onClick={toggleAudioStatus}
      >
        Sounds
      </button>
    </div>
  );
};

export default Buttons;
