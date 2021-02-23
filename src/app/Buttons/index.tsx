import { Fragment, FunctionalComponent, FunctionComponent, h } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

import { Context, State } from "../context";
import About from "./About";

import "./index.css";

const SoundOnIcon: FunctionComponent = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
      clipRule="evenodd"
    />
  </svg>
);

const SoundOffIcon: FunctionComponent = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const InfoIcon: FunctionalComponent = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);

const Buttons: FunctionComponent = () => {
  const { state, start, stop, isAudioEnabled, toggleAudioStatus } = useContext(
    Context
  );
  const [isVisible, setVisible] = useState(false);
  const [isAboutVisible, setAboutVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 200);
  }, []);

  const isActive = state === State.ACTIVE || state === State.PRE_ACTIVE;
  const onClick = isActive ? stop : start;
  const label = isActive ? "Stop" : "Start";

  return (
    <Fragment>
      <div className="buttons">
        <button
          className={`button button--disabled button--small ${
            isVisible ? "button--visible" : "button--hidden"
          }`}
          onClick={() => setAboutVisible(true)}
        >
          <InfoIcon />
        </button>

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
          {isAudioEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
        </button>
      </div>
      <About
        isVisible={isAboutVisible}
        onClose={() => setAboutVisible(false)}
      />
    </Fragment>
  );
};

export default Buttons;
