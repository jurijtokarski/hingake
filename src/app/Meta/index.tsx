import { FunctionComponent, h } from "preact";
import { useContext } from "preact/hooks";
import Helmet from "react-helmet";

import { Context, Step } from "../context";

const getTitle = (isActive: boolean, step: Step) => {
  if (!isActive) {
    return "Hingake";
  }

  if (step === Step.INHALE) {
    return "Inhale…";
  }

  if (step === Step.EXHALE) {
    return "Exhale…";
  }

  return "Wait…";
};

const Meta: FunctionComponent = () => {
  const { isActive, step } = useContext(Context);

  return (
    <Helmet>
      <title>{getTitle(isActive, step)}</title>
    </Helmet>
  );
};

export default Meta;
