import { h } from "preact";
import { mount, ReactWrapper } from "enzyme";

import Component from "../app/Buttons";
import {
  AppContext,
  Context,
  DEFAULT_CONTEXT_VALUES,
  State
} from "../app/context";

jest.useFakeTimers();

const stopMock = jest.fn();
const startMock = jest.fn();
const toggleAudioMock = jest.fn();

const props = {
  ...DEFAULT_CONTEXT_VALUES,
  stop: stopMock,
  start: startMock,
  toggleAudioStatus: toggleAudioMock
};

describe("Buttons", () => {
  let wrapper: ReactWrapper;

  function renderWrapper(value: AppContext) {
    wrapper = mount(
      <Context.Provider value={value}>
        <Component />
      </Context.Provider>
    );

    return wrapper;
  }

  function getComponent() {
    return wrapper.find(Component).find(".buttons");
  }

  beforeEach(() => {
    jest.spyOn(global, "setTimeout");
  });

  beforeAll(() => {
    renderWrapper(props);
  });

  afterAll(() => {
    wrapper.unmount();
  });

  test("renders without error", () => {
    expect(getComponent().length).toBe(1);
  });

  test("renders className", () => {
    expect(getComponent().find(".button.button--hidden").length).toBe(3);

    jest.runAllTimers();

    wrapper.update();

    expect(getComponent().find(".button.button--visible").length).toBe(3);
  });

  test("renders state className for first button", () => {
    expect(
      getComponent()
        .find(".button")
        .at(1)
        .hasClass("button--init")
    ).toBe(true);

    renderWrapper({
      ...props,
      state: State.PRE_ACTIVE
    });

    expect(
      getComponent()
        .find(".button")
        .at(1)
        .hasClass("button--pre_active")
    ).toBe(true);
  });

  test("renders audio status className for last button", () => {
    expect(
      getComponent()
        .find(".button")
        .last()
        .hasClass("button--disabled")
    ).toBe(true);

    renderWrapper({
      ...props,
      isAudioEnabled: true
    });

    expect(
      getComponent()
        .find(".button")
        .last()
        .hasClass("button--enabled")
    ).toBe(true);
  });

  test("calls start/stop on click", () => {
    getComponent()
      .find(".button")
      .at(1)
      .simulate("click");

    expect(startMock).toHaveBeenCalledTimes(1);
    expect(stopMock).toHaveBeenCalledTimes(0);

    renderWrapper({
      ...props,
      state: State.ACTIVE
    });

    getComponent()
      .find(".button")
      .at(1)
      .simulate("click");

    expect(startMock).toHaveBeenCalledTimes(1);
    expect(stopMock).toHaveBeenCalledTimes(1);
  });

  test("toggles audio on click", () => {
    getComponent()
      .find(".button")
      .last()
      .simulate("click");

    expect(toggleAudioMock).toHaveBeenCalledTimes(1);
  });
});
