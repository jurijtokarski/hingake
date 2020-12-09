import { ComponentType, h } from "preact";
import { shallow, ShallowWrapper } from "enzyme";

import Component from "../app/index";
import Background from "../app/Background";
import TopBar from "../app/TopBar";
import Content from "../app/Content";
import Info from "../app/Info";
import Animation from "../app/Animation";
import Buttons from "../app/Buttons";

// @todo #14 Increase Index component coverage to 80%

describe("Index", () => {
  let component: ShallowWrapper<ComponentType<Component>>;

  beforeAll(() => {
    component = shallow<ComponentType<Component>>(<Component />);
  });

  test("matches snapshot", () => {
    expect(component).toMatchSnapshot();
  });

  test("renders Background component", () => {
    expect(component.find(Background).length).toBe(1);
  });

  test("renders TopBar component", () => {
    expect(component.find(TopBar).length).toBe(1);
  });

  test("renders Content component", () => {
    expect(component.find(Content).length).toBe(1);
  });

  test("renders Info component", () => {
    expect(component.find(Info).length).toBe(1);
  });

  test("renders Animation component", () => {
    expect(component.find(Animation).length).toBe(1);
  });

  test("renders Buttons component", () => {
    expect(component.find(Buttons).length).toBe(1);
  });
});
