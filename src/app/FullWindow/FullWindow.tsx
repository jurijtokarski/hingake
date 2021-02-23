import { h, FunctionComponent } from "preact";

import "./full-window.css";

interface FullWindowProps {
  isVisible?: boolean;
  onClose: () => void;
}

const FullWindow: FunctionComponent<FullWindowProps> = ({
  isVisible,
  children,
  onClose
}) => (
  <div
    className={`full-window ${
      isVisible ? "full-window--visible" : "full-window--hidden"
    }`}
  >
    <div className="full-window__header">
      <button className="full-window__close" onClick={onClose}>
        Close
      </button>
    </div>
    <div className="full-window__content">{children}</div>
  </div>
);

export default FullWindow;
