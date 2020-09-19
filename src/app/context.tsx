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

export const DEFAULT_CONTEXT_VALUES = {
  mode: Mode.RELAX,
  isActive: false,
  activationTime: 0,
  step: Step.PAUSE,
  frame: 0,
  progress: 0,
  startTime: 0
};

export type AppContextValues = typeof DEFAULT_CONTEXT_VALUES;

export interface AppContext extends AppContextValues {
  start?: () => void;
  stop?: () => void;
}

export const Context = createContext<AppContext>(DEFAULT_CONTEXT_VALUES);
