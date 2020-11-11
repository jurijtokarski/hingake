import { parse } from "querystring";
import { round } from "@jurijtokarski/calc";

import {
  AUDIO_STATUS_STORAGE_KEY,
  NEXT_CHECK_STORAGE_KEY,
  RUN_COUNT_STORAGE_KEY,
  Step
} from "./context";

import inhaleAudioSrc from "../assets/sounds/inhale.m4a";
import exhaleAudioSrc from "../assets/sounds/exhale.m4a";
import pauseAudioSrc from "../assets/sounds/pause.m4a";
import waitAudioSrc from "../assets/sounds/wait.m4a";

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

export const getAudioStatus = () => {
  return getNumberValueFromStorage(AUDIO_STATUS_STORAGE_KEY);
};

export const setAudioStatus = (value: number) => {
  return saveNumberValueToStorage(AUDIO_STATUS_STORAGE_KEY, value);
};

export class Media {
  private step = Step.WAIT;

  private audios = {
    [Step.EXHALE]: new Audio(exhaleAudioSrc),
    [Step.INHALE]: new Audio(inhaleAudioSrc),
    [Step.PAUSE]: new Audio(pauseAudioSrc),
    [Step.WAIT]: new Audio(waitAudioSrc)
  };

  setStep(step: Step) {
    this.step = step;
  }

  setEnabled(value: boolean) {
    for (const key of Object.keys(this.audios) as Step[]) {
      this.getInstanceByKey(key).muted = !value;
    }
  }

  private getInstanceByKey(key: Step) {
    return this.audios[key];
  }

  private getCurrentInstance() {
    return this.getInstanceByKey(this.step);
  }

  private volumeFadeUp = (current: HTMLAudioElement) => {
    const FADE_UP_DURATION = 1500;

    function run() {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      setTimeout(tick, FADE_UP_DURATION / 100);
    }

    function tick() {
      const volume = current.volume;

      if (volume >= 1) {
        return;
      }

      current.volume = round((volume * 100 + 1) / 100, 3);

      run();
    }

    run();
  };

  private volumeFadeDown = (current: HTMLAudioElement) => {
    const FADE_DOWN_DURATION = 1000;

    function run() {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      setTimeout(tick, FADE_DOWN_DURATION / 100);
    }

    function tick() {
      const volume = current.volume;

      if (volume <= 0) {
        current.pause();
        return;
      }

      current.volume = round((volume * 100 - 1) / 100, 3);

      run();
    }

    run();
  };

  stopCurrent() {
    const current = this.getCurrentInstance();

    this.volumeFadeDown(current);
  }

  playCurrent() {
    const current = this.getCurrentInstance();

    current.volume = 0;
    current.currentTime = 0;
    current.play();

    this.volumeFadeUp(current);
  }

  setStepAndPlay(step: Step) {
    this.stopCurrent();
    this.setStep(step);
    this.playCurrent();
  }

  reset(key: Step) {
    const instance = this.getInstanceByKey(key);

    instance.pause();
    instance.currentTime = 0;
    instance.volume = 0;
  }

  resetAll() {
    for (const key of Object.keys(this.audios) as Step[]) {
      this.reset(key);
    }
  }
}
