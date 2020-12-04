import { parse } from "querystring";

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

const createAudio = (src: string) => {
  return isServer() ? null : new window.Audio(src);
};

export class Media {
  private step = Step.WAIT;

  private audios = {
    [Step.EXHALE]: createAudio(exhaleAudioSrc),
    [Step.INHALE]: createAudio(inhaleAudioSrc),
    [Step.PAUSE]: createAudio(pauseAudioSrc),
    [Step.WAIT]: createAudio(waitAudioSrc)
  };

  unlock() {
    for (const key of Object.keys(this.audios) as Step[]) {
      const instance = this.getInstanceByKey(key);

      if (!instance) {
        return;
      }

      instance.play();
      instance.pause();
      instance.currentTime = 0;
    }
  }

  setStep(step: Step) {
    this.step = step;
  }

  setEnabled(value: boolean) {
    for (const key of Object.keys(this.audios) as Step[]) {
      const instance = this.getInstanceByKey(key);

      if (!instance) {
        continue;
      }

      instance.muted = !value;
      instance.volume = Number(value);
    }
  }

  private getInstanceByKey(key: Step) {
    return this.audios[key];
  }

  private getCurrentInstance() {
    return this.getInstanceByKey(this.step);
  }

  playCurrent() {
    const current = this.getCurrentInstance();

    if (!current) {
      return;
    }

    function handleEnd() {
      if (!current) {
        return;
      }

      current.pause();
      current.currentTime = 0;
      current.removeEventListener("ended", handleEnd);
    }

    current.play();
    current.addEventListener("ended", handleEnd);
  }

  setStepAndPlay(step: Step) {
    this.setStep(step);
    this.playCurrent();
  }

  reset(key: Step) {
    const instance = this.getInstanceByKey(key);

    if (!instance) {
      return;
    }

    instance.pause();
    instance.currentTime = 0;
  }

  resetAll() {
    for (const key of Object.keys(this.audios) as Step[]) {
      this.reset(key);
    }
  }
}
