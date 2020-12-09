import { h } from "preact";
import { shallow } from "enzyme";

import Component from "../app/index";
import Background from "../app/Background";
import TopBar from "../app/TopBar";
import Content from "../app/Content";
import Info from "../app/Info";
import Animation from "../app/Animation";
import Buttons from "../app/Buttons";

describe("[ Index ]", () => {
  test("Should render Background", () => {
    const component = shallow(<Component />);
    expect(component.find(Background).length).toBe(1);
  });

  test("Should render TopBar", () => {
    const component = shallow(<Component />);
    expect(component.find(TopBar).length).toBe(1);
  });

  test("Should render Content", () => {
    const component = shallow(<Component />);
    expect(component.find(Content).length).toBe(1);
  });

  test("Should render Info", () => {
    const component = shallow(<Component />);
    expect(component.find(Info).length).toBe(1);
  });

  test("Should render Animation", () => {
    const component = shallow(<Component />);
    expect(component.find(Animation).length).toBe(1);
  });

  test("Should render Buttons", () => {
    const component = shallow(<Component />);
    expect(component.find(Buttons).length).toBe(1);
  });
});
