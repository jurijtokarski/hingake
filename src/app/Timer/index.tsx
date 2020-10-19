import { FunctionComponent, h } from "preact";
import { useContext, useState, useEffect } from "preact/hooks";

import { Context } from "../context";

import "./index.css";

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s]
    .filter(Boolean)
    .join(":");
}

const Timer: FunctionComponent = () => {
  const { isActive, activationTime } = useContext(Context);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const seconds = activationTime
    ? Number(((Date.now() - activationTime) / 1000).toFixed(0))
    : 0;

  return (
    <div
      className={`timer ${isVisible ? "timer--visible" : "timer--hidden"} ${
        isActive ? "timer--active" : "timer--inactive"
      }`}
    >
      {formatTime(seconds)}
    </div>
  );
};

export default Timer;
