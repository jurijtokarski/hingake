import {
  AUDIO_STATUS_STORAGE_KEY,
  NEXT_CHECK_STORAGE_KEY,
  RUN_COUNT_STORAGE_KEY,
  Step
} from "../app/context";

import {
  easeInQuad,
  easeOutQuad,
  getLocationQueryParams,
  getScaleByStepProgress,
  getTitleByStep,
  getUserAgent,
  isIOS,
  isInStandaloneMode,
  isServer,
  getNumberValueFromStorage,
  saveNumberValueToStorage,
  getNextCheckTimestamp,
  setNextCheckTimestamp,
  getRunCount,
  setRunCount,
  getAudioStatus,
  setAudioStatus,
  createAudio,
  Media
} from "../app/utils";

import { mockedAudios, AudioMock } from "./__mocks__/browserMocks";

describe("Utils", () => {
  describe("easeInQuad", () => {
    const map = [
      [0, 0],
      [1, 1],
      [2, 4],
      [3, 9],
      [4, 16],
      [5, 25]
    ];

    for (const [param, result] of map) {
      test(`results ${result} for ${param}`, () => {
        expect(easeInQuad(param)).toBe(result);
      });
    }
  });

  describe("easeOutQuad", () => {
    const map = [
      [0, 0],
      [1, 1],
      [2, 0],
      [3, -3],
      [4, -8],
      [5, -15]
    ];

    for (const [param, result] of map) {
      test(`results ${result} for ${param}`, () => {
        expect(easeOutQuad(param)).toBe(result);
      });
    }
  });

  describe("getScaleByStepProgress", () => {
    test("returns 0 for pause step", () => {
      expect(getScaleByStepProgress(Step.PAUSE, 0.5)).toBe(0);
    });

    test("returns 1 for wait step", () => {
      expect(getScaleByStepProgress(Step.WAIT, 0.5)).toBe(1);
    });

    const exchaleMap = [
      [0, 1],
      [0.1, 0.81],
      [0.2, 0.64],
      [0.3, 0.49],
      [0.4, 0.36],
      [0.5, 0.25],
      [0.6, 0.16],
      [0.7, 0.09],
      [0.8, 0.04],
      [0.9, 0.01],
      [1, 0]
    ];

    for (const [param, result] of exchaleMap) {
      test(`returns ${result} for ${param} in exhale step`, () => {
        expect(getScaleByStepProgress(Step.EXHALE, param)).toBe(result);
      });
    }

    const inhaleMap = [
      [0, 0],
      [0.1, 0.19],
      [0.2, 0.36],
      [0.3, 0.51],
      [0.4, 0.64],
      [0.5, 0.75],
      [0.6, 0.84],
      [0.7, 0.91],
      [0.8, 0.96],
      [0.9, 0.99],
      [1, 1]
    ];

    for (const [param, result] of inhaleMap) {
      test(`returns ${result} for ${param} in inhale step`, () => {
        expect(getScaleByStepProgress(Step.INHALE, param)).toBe(result);
      });
    }
  });

  describe("isServer", () => {
    test("returns `false`", () => {
      expect(isServer()).toBe(false);
    });
  });

  describe("getUserAgent", () => {
    test("returns `test`", () => {
      expect(getUserAgent()).toContain("test");
    });
  });

  describe("getLocationQueryParams", () => {
    test("returns params", () => {
      expect(getLocationQueryParams()).toEqual({
        mock: "test",
        test: "mock"
      });
    });
  });

  describe("getNumberValueFromStorage", () => {
    test("returns 0 when no value found", () => {
      expect(getNumberValueFromStorage("any-key")).toBe(0);
    });

    test("returns `100` form `mock` key", () => {
      expect(getNumberValueFromStorage("mock")).toBe(100);
    });

    test.todo("returns `0` when localStorage not supported");
  });

  describe("saveNumberValueToStorage", () => {
    test("return 0 when no value found", () => {
      expect(getNumberValueFromStorage("mock2")).toBe(0);
      saveNumberValueToStorage("mock2", 8756);
      expect(getNumberValueFromStorage("mock2")).toBe(8756);
    });
  });

  describe("Storage methods", () => {
    const map: [string, Function, Function][] = [
      [NEXT_CHECK_STORAGE_KEY, getNextCheckTimestamp, setNextCheckTimestamp],
      [RUN_COUNT_STORAGE_KEY, getRunCount, setRunCount],
      [AUDIO_STATUS_STORAGE_KEY, getAudioStatus, setAudioStatus]
    ];

    for (const [storageKey, getter, setter] of map) {
      test(`correctly get and set ${storageKey} data`, () => {
        expect(getter(storageKey)).toBe(0);
        setter(1);
        expect(getter(storageKey)).toBe(1);
      });
    }
  });

  describe("isIOS", () => {
    test("returns `false` when wasn't detected iOS device", () => {
      expect(isIOS()).toBe(false);
    });

    test.todo("returns `true` when was detected iOS device");
  });

  describe("isInStandaloneMode", () => {
    test("returns `false` when wasn't detected iOS device", () => {
      expect(isInStandaloneMode()).toBe(false);
    });

    test.todo("returns `true` when was detected iOS device");
  });

  describe("getTitleByStep", () => {
    const map: [Step, string][] = [
      [Step.EXHALE, "Exhale"],
      [Step.INHALE, "Inhale"],
      [Step.WAIT, "Hold"],
      [Step.PAUSE, "Wait"]
    ];

    for (const [param, result] of map) {
      test(`returns ${result} for ${param} in inhale step`, () => {
        expect(getTitleByStep(param)).toContain(result);
      });
    }
  });

  describe("Media", () => {
    let media: Media | null = null;
    let audio: ReturnType<typeof AudioMock> | null = null;

    beforeEach(() => {
      media = new Media();
      audio = (mockedAudios as { [key: string]: ReturnType<typeof AudioMock> })[
        "test-file-stub"
      ];
    });

    afterEach(() => {
      media = null;
      audio = null;
    });

    test.todo("unlock() not called when no instance");

    test("unlock()", () => {
      media?.unlock();

      expect(audio?.wasPlayed).toBe(true);
      expect(audio?.wasPaused).toBe(true);
      expect(audio?.currentTimeWasSet).toBe(true);
      expect(audio?.volumeWasSet).toBe(false);
      expect(audio?.mutedWasSet).toBe(false);
    });

    test.todo("setEnabled() not called when no instance");

    test("setEnabled()", () => {
      media?.setEnabled(true);

      expect(audio?.wasPlayed).toBe(false);
      expect(audio?.wasPaused).toBe(false);
      expect(audio?.currentTimeWasSet).toBe(false);
      expect(audio?.volumeWasSet).toBe(true);
      expect(audio?.mutedWasSet).toBe(true);
    });

    test.todo("setStepAndPlay()");

    test.todo("playCurrent() not called when no instance");

    test("playCurrent()", () => {
      media?.playCurrent();

      expect(audio?.wasPlayed).toBe(true);
      expect(audio?.wasPaused).toBe(false);
      expect(audio?.currentTimeWasSet).toBe(false);
      expect(audio?.addedEventListener).toBe(true);
      expect(audio?.removedEventListener).toBe(false);

      audio?.listeners.ended();

      expect(audio?.wasPlayed).toBe(true);
      expect(audio?.wasPaused).toBe(true);
      expect(audio?.currentTimeWasSet).toBe(true);
      expect(audio?.addedEventListener).toBe(true);
      expect(audio?.removedEventListener).toBe(true);
    });

    test.todo("reset() not called when no instance");

    test("resetAll()", () => {
      media?.resetAll();
      expect(audio?.wasPaused).toBe(true);
      expect(audio?.currentTimeWasSet).toBe(true);
    });
  });

  describe("Server-specific", () => {
    let originalWindow: Window & typeof globalThis;

    beforeAll(() => {
      originalWindow = global.window;

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      delete global.window;
    });

    afterAll(() => {
      global.window = originalWindow;
    });

    test("isServer() returns `true`", () => {
      expect(isServer()).toBe(true);
    });

    test("getUserAgent() returns emtry string", () => {
      expect(getUserAgent()).toBe("");
    });

    test("getLocationQueryParams() returns emtry object", () => {
      expect(getLocationQueryParams()).toEqual({});
    });

    test("getNumberValueFromStorage() returns 0", () => {
      expect(getNumberValueFromStorage("any-key")).toBe(0);
    });

    describe("saveNumberValueToStorage() does not set the value", () => {
      test("return 0 when no value found", () => {
        expect(getNumberValueFromStorage("mock2")).toBe(0);
        saveNumberValueToStorage("mock2", 123123);
        expect(getNumberValueFromStorage("mock2")).toBe(0);
      });
    });

    test("createAudio() returns `null`", () => {
      expect(createAudio("any-key")).toBe(null);
    });
  });
});
