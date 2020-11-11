import { createContext } from "preact";

export enum Step {
  PAUSE = "PAUSE",
  INHALE = "INHALE",
  WAIT = "WAIT",
  EXHALE = "EXHALE"
}

export enum Mode {
  RELAX = "RELAX",
  EQUAL = "EQUAL"
}

export const ModeConfig = {
  [Mode.RELAX]: {
    [Step.PAUSE]: 0,
    [Step.INHALE]: 4,
    [Step.WAIT]: 7,
    [Step.EXHALE]: 8
  },
  [Mode.EQUAL]: {
    [Step.PAUSE]: 1,
    [Step.INHALE]: 4,
    [Step.WAIT]: 1,
    [Step.EXHALE]: 4
  }
} as const;

export const PRE_ACTIVE_DELAY = 1000;

export enum State {
  INIT = "INIT",
  PRE_ACTIVE = "PRE_ACTIVE",
  ACTIVE = "ACTIVE",
  POST_ACTIVE = "POST_ACTIVE"
}

export const DEFAULT_CONTEXT_VALUES = {
  mode: Mode.RELAX,
  step: Step.PAUSE,
  state: State.INIT,
  activationTime: 0,
  frame: 0,
  progress: 0,
  startTime: 0,
  isAudioEnabled: false
};

export type AppContextValues = typeof DEFAULT_CONTEXT_VALUES;

export interface AppContext extends AppContextValues {
  start?: () => void;
  stop?: () => void;
  toggleAudioStatus?: () => void;
}

export const Context = createContext<AppContext>(DEFAULT_CONTEXT_VALUES);

export const NEXT_CHECK_STORAGE_KEY = "next_check";

export const RUN_COUNT_STORAGE_KEY = "run_count";

export const AUDIO_STATUS_STORAGE_KEY = "audio_status";
