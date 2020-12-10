const localStorageMock = (function() {
  let store = {
    mock: "100"
  };

  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => (store[key] = value.toString()),
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

export const mockedAudios = {};

export function AudioMock(src) {
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
    __mutedolume: 0,
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
    },
    play() {
      this.wasPlayed = true;
    },
    pause() {
      this.wasPaused = true;
    },
    addEventListener(key, fn) {
      this.addedEventListener = true;
      this.listeners[key] = fn;
    },
    removeEventListener(key) {
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
