import { FunctionComponent, h } from "preact";

import "./index.css";

interface ContentProps {
  children: JSX.Element;
}

const Content: FunctionComponent<ContentProps> = ({ children }) => (
  <main className="content">{children}</main>
);

export default Content;
