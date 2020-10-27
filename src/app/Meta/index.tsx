import { FunctionComponent, h } from "preact";
import { useContext } from "preact/hooks";
import Helmet from "react-helmet";

import { Context, State, Step } from "../context";
import { getTitleByStep } from "../utils";

const getTitle = (isActive: boolean, step: Step) => {
  if (!isActive) {
    return "Hingake";
  }

  return getTitleByStep(step);
};

const Meta: FunctionComponent = () => {
  const { state, step } = useContext(Context);

  return (
    <Helmet>
      <title>{getTitle(state === State.ACTIVE, step)}</title>
    </Helmet>
  );
};

export default Meta;
