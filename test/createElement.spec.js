import { it, expect, describe } from "vitest";
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
    const child = {
      type: "TEXT_NODE",
      props: {
        nodeValue: "test",
        children: [],
      },
    };
    const element = React.createElement("div", { id: "test" }, child);
    expect(element).toEqual({
      type: "div",
      props: {
        id: "test",
        children: [child],
      },
    });
  });
});
