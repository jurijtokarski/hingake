import { Step } from "./context";

export function easeInQuad(x: number): number {
  return x * x;
}

export function easeOutQuad(x: number): number {
  return 1 - (1 - x) * (1 - x);
}

export function getScaleByStepProgress(step: Step, progress: number) {
  if (step === Step.PAUSE) {
    return 0;
  }

  if (step === Step.WAIT) {
    return 1;
  }

  if (step === Step.EXHALE) {
    return easeInQuad(1 - 1 * progress); // from 1 to 0
  }

  return easeOutQuad(1 * progress); // from 0 to 1
}

export const isIOS = () =>
  /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

// @todo Remove ts-ignore: now TypeScript type doesn't see standalone option in window.navigator
export const isInStandaloneMode = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return "standalone" in window.navigator && window.navigator.standalone;
};
