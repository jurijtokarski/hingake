import { parse } from "querystring";

import { NEXT_CHECK_STORAGE_KEY, RUN_COUNT_STORAGE_KEY, Step } from "./context";

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

export const isServer = () => typeof window === "undefined";

export const getUserAgent = () => {
  if (isServer()) {
    return "";
  }

  return window.navigator.userAgent.toLowerCase();
};

export const getLocationQueryParams = () => {
  if (isServer()) {
    return {};
  }

  return parse(window.location.search.substr(1));
};

export const isIOS = () => /iphone|ipad|ipod/.test(getUserAgent());

export const isInStandaloneMode = () => {
  return getLocationQueryParams().source === "pwa";
};

export const getTitleByStep = (step: Step) => {
  if (step === Step.INHALE) {
    return "Inhale…";
  }

  if (step === Step.EXHALE) {
    return "Exhale…";
  }

  return "Wait…";
};

export const getNumberValueFromStorage = (key: string): number => {
  if (isServer()) {
    return 0;
  }

  if ("localStorage" in window) {
    return parseInt(window.localStorage?.getItem(key) || "0", 10);
  }

  return 0;
};

export const saveNumberValueToStorage = (key: string, value: number): void => {
  if (isServer()) {
    return;
  }

  if ("localStorage" in window) {
    return window.localStorage?.setItem(key, value.toString());
  }
};

export const getNextCheckTimestamp = () => {
  return getNumberValueFromStorage(NEXT_CHECK_STORAGE_KEY);
};

export const setNextCheckTimestamp = (value: number) => {
  return saveNumberValueToStorage(NEXT_CHECK_STORAGE_KEY, value);
};

export const getRunCount = () => {
  return getNumberValueFromStorage(RUN_COUNT_STORAGE_KEY);
};

export const setRunCount = (value: number) => {
  return saveNumberValueToStorage(RUN_COUNT_STORAGE_KEY, value);
};
