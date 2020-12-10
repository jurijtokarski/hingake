const localStorageMock = (function() {
  let store: { [key: string]: string } = {
    mock: "100"
  };

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string | number) =>
      (store[key] = value.toString()),
    clear: () => (store = {})
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock
});

Object.defineProperty(window, "location", {
  value: {
    search: "?mock=test&test=mock"
  }
});

Object.defineProperty(window.navigator, "userAgent", {
  value: "test"
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockedAudios: { [key: string]: Record<string, any> } = {};

export function AudioMock(src: string) {
  const audio = {
    wasPlayed: false,
    wasPaused: false,
    __currentTime: 0,
    currentTimeWasSet: false,
    get currentTime() {
      return this.__currentTime;
    },
    set currentTime(value) {
      this.currentTimeWasSet = true;
      this.__currentTime = value;
    },
    __volume: 0,
    volumeWasSet: false,
    get volume() {
      return this.__volume;
    },
    set volume(value) {
      this.volumeWasSet = true;
      this.__volume = value;
    },
    __muted: 0,
    mutedWasSet: false,
    get muted() {
      return this.__muted;
    },
    set muted(value) {
      this.mutedWasSet = true;
      this.__muted = value;
    },
    addedEventListener: false,
    removedEventListener: false,
    listeners: {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      ended: () => {}
    } as { [key: string]: Function },
    play() {
      this.wasPlayed = true;
    },
    pause() {
      this.wasPaused = true;
    },
    addEventListener(key: string, fn: Function) {
      this.addedEventListener = true;
      this.listeners[key] = fn;
    },
    removeEventListener(key: string) {
      this.removedEventListener = true;
      delete this.listeners[key];
    }
  };
  mockedAudios[src] = audio;
  return audio;
}

Object.defineProperty(window, "Audio", {
  value: AudioMock
});
