import { h } from "preact";
import { shallow, ShallowWrapper } from "enzyme";

import Component from "../app/Background";

const ChildrenMock = () => <div></div>;

describe("Index", () => {
  let component: ShallowWrapper;

  beforeAll(() => {
    component = shallow(
      <Component>
        <ChildrenMock />
      </Component>
    );
  });

  test("matches snapshot", () => {
    expect(component).toMatchSnapshot();
  });

  test("renders children", () => {
    expect(component.find(ChildrenMock).length).toBe(1);
  });

  test("renders className", () => {
    expect(component.hasClass("background")).toBe(true);
  });
});
