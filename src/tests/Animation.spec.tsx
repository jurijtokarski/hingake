import { h } from "preact";
import { mount, ReactWrapper } from "enzyme";

import Component from "../app/Animation";
import {
  AppContext,
  Context,
  DEFAULT_CONTEXT_VALUES,
  State,
  Step
} from "../app/context";

jest.useFakeTimers();

describe("Animation", () => {
  let wrapper: ReactWrapper;

  function renderWrapper(value: AppContext) {
    wrapper = mount(
      <Context.Provider value={value}>
        <Component />
      </Context.Provider>
    );

    return wrapper;
  }

  function getSVG() {
    return wrapper.find(Component).find("svg");
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
    expect(getSVG().length).toBe(1);
  });

  test("renders className", () => {
    expect(getSVG().hasClass("animation")).toBe(true);
    expect(getSVG().hasClass("animation--init")).toBe(true);
    expect(getSVG().hasClass("animation--hidden")).toBe(true);

    jest.runAllTimers();

    wrapper.update();

    expect(getSVG().hasClass("animation--visible")).toBe(true);
  });

  test("renders initial size", () => {
    expect(getSVG().prop("style")?.width).toBe("10.5rem");
    expect(getSVG().prop("style")?.height).toBe("10.5rem");
  });

  test("renders petals", () => {
    expect(getSVG().find("defs path#petal").length).toBe(1);
    expect(getSVG().find("use").length).toBe(12);
  });

  test("renders className based on pre_active state", () => {
    renderWrapper({
      ...DEFAULT_CONTEXT_VALUES,
      state: State.PRE_ACTIVE
    });

    expect(getSVG().hasClass("animation--pre_active")).toBe(true);
  });

  test("renders className based on active state", () => {
    renderWrapper({
      ...DEFAULT_CONTEXT_VALUES,
      state: State.ACTIVE
    });

    expect(getSVG().hasClass("animation--active")).toBe(true);
  });

  test("renders start size on PAUSE step", () => {
    renderWrapper({
      ...DEFAULT_CONTEXT_VALUES,
      state: State.ACTIVE,
      step: Step.PAUSE
    });

    expect(getSVG().prop("style")?.width).toBe("10.5rem");
    expect(getSVG().prop("style")?.height).toBe("10.5rem");
  });

  test("renders increased size on INHALE step", () => {
    const base = {
      ...DEFAULT_CONTEXT_VALUES,
      state: State.ACTIVE,
      step: Step.INHALE,
      progress: 0
    };

    renderWrapper(base);

    expect(getSVG().prop("style")?.width).toBe("10.5rem");
    expect(getSVG().prop("style")?.height).toBe("10.5rem");

    renderWrapper({
      ...base,
      progress: 0.25
    });

    expect(getSVG().prop("style")?.width).toBe("13.5625rem");
    expect(getSVG().prop("style")?.height).toBe("13.5625rem");

    renderWrapper({
      ...base,
      progress: 0.5
    });

    expect(getSVG().prop("style")?.width).toBe("15.75rem");
    expect(getSVG().prop("style")?.height).toBe("15.75rem");

    renderWrapper({
      ...base,
      progress: 0.75
    });

    expect(getSVG().prop("style")?.width).toBe("17.0625rem");
    expect(getSVG().prop("style")?.height).toBe("17.0625rem");
  });

  test("renders decreased size on INHALE step", () => {
    const base = {
      ...DEFAULT_CONTEXT_VALUES,
      state: State.ACTIVE,
      step: Step.EXHALE,
      progress: 0
    };

    renderWrapper(base);

    expect(getSVG().prop("style")?.width).toBe("17.5rem");
    expect(getSVG().prop("style")?.height).toBe("17.5rem");

    renderWrapper({
      ...base,
      progress: 0.25
    });

    expect(getSVG().prop("style")?.width).toBe("14.4375rem");
    expect(getSVG().prop("style")?.height).toBe("14.4375rem");

    renderWrapper({
      ...base,
      progress: 0.5
    });

    expect(getSVG().prop("style")?.width).toBe("12.25rem");
    expect(getSVG().prop("style")?.height).toBe("12.25rem");

    renderWrapper({
      ...base,
      progress: 0.75
    });

    expect(getSVG().prop("style")?.width).toBe("10.9375rem");
    expect(getSVG().prop("style")?.height).toBe("10.9375rem");
  });

  test("renders finish size on WAIT step", () => {
    renderWrapper({
      ...DEFAULT_CONTEXT_VALUES,
      state: State.ACTIVE,
      step: Step.WAIT
    });

    expect(getSVG().prop("style")?.width).toBe("17.5rem");
    expect(getSVG().prop("style")?.height).toBe("17.5rem");
  });

  test("renders className based on post_active state", () => {
    renderWrapper({
      ...DEFAULT_CONTEXT_VALUES,
      state: State.POST_ACTIVE
    });

    expect(getSVG().hasClass("animation--post_active")).toBe(true);
    expect(getSVG().hasClass("animation--hidden")).toBe(true);

    jest.runAllTimers();

    wrapper.update();

    expect(getSVG().hasClass("animation--visible")).toBe(true);
  });
});
