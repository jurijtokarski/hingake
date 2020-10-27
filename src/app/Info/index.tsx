import { FunctionComponent, h } from "preact";
import { useContext, useState, useEffect } from "preact/hooks";

import { Context, State } from "../context";
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

const Info: FunctionComponent = () => {
  const { state, step, activationTime } = useContext(Context);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const content = (() => {
    const seconds = activationTime
      ? Number(((Date.now() - activationTime) / 1000).toFixed(0))
      : 0;

    switch (state) {
      case State.POST_ACTIVE:
        return formatTime(seconds);
      case State.PRE_ACTIVE:
        return "Prepare…";
      case State.ACTIVE:
        return getTitleByStep(step);
      default:
        return "";
    }
  })();

  return (
    <div className={`info ${isVisible ? "info--visible" : "info--hidden"}`}>
      {content}
    </div>
  );
};

export default Info;
