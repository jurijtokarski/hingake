import { h } from "preact";
import { shallow } from "enzyme";

import Component from "../app/TopBar/index";

// @todo #21 Increase TopBar component coverage to 80%

describe("Topbar", () => {
  test("renders null be default", () => {
    const component = shallow(<Component />);
    expect(component.isEmptyRender()).toBe(true);
  });

  describe("iOS install banner", () => {
    test.todo("renders hidden <IOSInstall /> component");

    test.todo("renders Install button");

    test.todo("open install modal on Install button click");

    test.todo("renders Close button");

    test.todo("closes install banner on Close button click");

    test.todo("saves next check information to storage on Close button click");
  });
});
