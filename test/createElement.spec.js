import { it, expect, describe, vi, beforeAll } from "vitest";
import React from "../core/React";
describe("createElement", () => {
  it("return a dom for element", () => {
    const element = React.createElement("div", null, "test");
    expect(element).toEqual({
      type: "div",
      props: {
        children: [
          {
            type: "TEXT_NODE",
            props: {
              nodeValue: "test",
              children: [],
            },
          },
        ],
      },
    });
  });
  it("create vdom with props and children", () => {
    const element = React.createElement(
      "div",
      { id: "test" },
      React.createElement("div", null, "test")
    );
    expect(element).toEqual({
      type: "div",
      props: {
        id: "test",
        children: [
          {
            type: "div",
            props: {
              children: [
                {
                  type: "TEXT_NODE",
                  props: {
                    nodeValue: "test",
                    children: [],
                  },
                },
              ],
            },
          },
        ],
      },
    });
  });
  // it("render function", () => {
  //   const text = {
  //     type: "TEXT_NODE",
  //     props: {
  //       nodeValue: "test",
  //       children: [],
  //     },
  //   };
  //   const container = document.createElement("div");
  //   React.render(text, container);
  //   expect(container.innerHTML).toBe("test");
  // });
});
