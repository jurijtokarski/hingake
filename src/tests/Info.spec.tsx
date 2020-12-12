import { h } from "preact";
import { mount, ReactWrapper } from "enzyme";

import Component from "../app/Info";
import {
  AppContext,
  Context,
  DEFAULT_CONTEXT_VALUES,
  State,
  Step
} from "../app/context";

jest.useFakeTimers();

describe("Info", () => {
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
    return wrapper.find(Component).find(".info");
  }

  beforeEach(() => {
    jest.spyOn(global, "setTimeout");
  });

  beforeAll(() => {
    renderWrapper(DEFAULT_CONTEXT_VALUES);
  });

  afterAll(() => {
    wrapper.unmount();
  });

  test("renders without error", () => {
    expect(getComponent().length).toBe(1);
  });

  test("renders classNames", () => {
    expect(getComponent().hasClass("info--hidden")).toBe(true);

    jest.runAllTimers();

    wrapper.update();

    expect(getComponent().hasClass("info--visible")).toBe(true);
  });

  test("renders summary", () => {
    expect(getComponent().text()).toBe("");

    renderWrapper({
      ...DEFAULT_CONTEXT_VALUES,
      state: State.PRE_ACTIVE
    });

    expect(getComponent().text()).toContain("Prepare");

    renderWrapper({
      ...DEFAULT_CONTEXT_VALUES,
      state: State.ACTIVE,
      step: Step.INHALE
    });

    expect(getComponent().text()).toContain("Inhale");

    renderWrapper({
      ...DEFAULT_CONTEXT_VALUES,
      state: State.ACTIVE,
      step: Step.EXHALE
    });

    expect(getComponent().text()).toContain("Exhale");

    renderWrapper({
      ...DEFAULT_CONTEXT_VALUES,
      state: State.ACTIVE,
      step: Step.PAUSE
    });

    expect(getComponent().text()).toContain("Wait");

    renderWrapper({
      ...DEFAULT_CONTEXT_VALUES,
      state: State.ACTIVE,
      step: Step.WAIT
    });

    expect(getComponent().text()).toContain("Wait");

    renderWrapper({
      ...DEFAULT_CONTEXT_VALUES,
      state: State.POST_ACTIVE,
      activationTime: Date.now() - 1000,
      count: 1
    });

    expect(getComponent().text()).toContain("0:01");
    expect(getComponent().text()).toContain("1 times");

    renderWrapper({
      ...DEFAULT_CONTEXT_VALUES,
      state: State.POST_ACTIVE,
      activationTime: Date.now() - 11500,
      count: 0
    });

    expect(getComponent().text()).toBe("0:12");

    renderWrapper({
      ...DEFAULT_CONTEXT_VALUES,
      state: State.POST_ACTIVE,
      activationTime: Date.now() - 115000,
      count: 0
    });

    expect(getComponent().text()).toBe("1:55");

    renderWrapper({
      ...DEFAULT_CONTEXT_VALUES,
      state: State.POST_ACTIVE,
      activationTime: Date.now() - 1150000,
      count: 0
    });

    expect(getComponent().text()).toBe("19:10");

    renderWrapper({
      ...DEFAULT_CONTEXT_VALUES,
      state: State.POST_ACTIVE,
      activationTime: Date.now() - 11500000,
      count: 0
    });

    expect(getComponent().text()).toBe("3:11:40");
  });
});
