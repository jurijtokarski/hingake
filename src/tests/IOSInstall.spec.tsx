import { h } from "preact";
import { shallow, ShallowWrapper } from "enzyme";

import Component from "../app/TopBar/IOSInstall";

const onCloseMock = jest.fn();

const hiddenProps = {
  isVisible: false,
  onClose: onCloseMock
};

const visibleProps = {
  ...hiddenProps,
  isVisible: true
};

describe("TopBar/IOSInstall", () => {
  test("renders classNames", () => {
    const component = shallow(<Component {...hiddenProps} />);

    expect(component.hasClass("ios-install")).toBe(true);
    expect(component.hasClass("ios-install--hidden")).toBe(true);

    component.setProps(visibleProps).update();

    expect(component.hasClass("ios-install--visible")).toBe(true);
  });

  describe("Close button", () => {
    let component: ShallowWrapper;
    let button: ShallowWrapper;

    beforeAll(() => {
      component = shallow(<Component {...visibleProps} />);
      button = component.find(".ios-install__close");
    });

    test("renders close button", () => {
      expect(button.length).toBe(1);
    });

    test("calls function on click", () => {
      button.simulate("click");
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });
});
