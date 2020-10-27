import { FunctionComponent, h } from "preact";

import "./index.css";

interface BackgroundProps {
  children: JSX.Element;
}

const Background: FunctionComponent<BackgroundProps> = ({ children }) => {
  return <div className="background">{children}</div>;
};

export default Background;
