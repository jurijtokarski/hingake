import { round } from "@jurijtokarski/calc";
import { Fragment, FunctionComponent, h } from "preact";
import { useContext, useState, useEffect, useRef } from "preact/hooks";

import { Context, ModeConfig, State } from "../context";
import { getTitleByStep } from "../utils";

import "./index.css";

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s]
    .filter(Boolean)
    .join(":");
}

function formatCount(count: number) {
  return count ? `${count} times` : "";
}

function formatPostActive(seconds: number, count: number) {
  const duration = formatTime(seconds);
  const times = formatCount(count);

  if (times) {
    return `${duration}, ${times}`;
  }

  return duration;
}

function usePrevious<T = any>(value: T): T {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

const Info: FunctionComponent = () => {
  const {
    state,
    step,
    mode,
    count,
    activationTime,
    progress,
    startTime
  } = useContext(Context);
  const [isVisible, setVisible] = useState(false);
  const [isActive, setActive] = useState(false);
  const previousState = usePrevious(state);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  useEffect(() => {
    if (isActive) {
      return;
    }

    if (state !== State.PRE_ACTIVE) {
      return;
    }

    setActive(true);
  }, [isActive, state]);

  const getActiveStepLabel = () => {
    const secondsLeft = round(
      ModeConfig[mode][step] * (1 - progress) + 0.45,
      0
    );

    if (Date.now() - startTime > 1000) {
      return secondsLeft;
    }

    return getTitleByStep(step);
  };

  const content = (() => {
    const seconds = activationTime
      ? Number(((Date.now() - activationTime) / 1000).toFixed(0))
      : 0;

    switch (state) {
      case State.POST_ACTIVE:
        return formatPostActive(seconds, count);
      case State.PRE_ACTIVE:
        return "Prepare…";
      case State.ACTIVE:
        return getActiveStepLabel();
      default:
        return "";
    }
  })();

  return (
    <div
      className={`info ${isVisible ? "info--visible" : "info--hidden"} ${
        isActive ? "info--active" : "info--inactive"
      }`}
    >
      {content}
    </div>
  );
};

export default Info;
