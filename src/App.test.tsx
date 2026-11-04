import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { App } from "./App";

describe("demo local UI", () => {
  it("solicita selección de héroes sin exponer las manos durante la preparación", () => {
    const html = renderToStaticMarkup(createElement(App));
    expect(html).toContain("Selección de héroes");
    expect(html).not.toContain("Mano de P1");
    expect(html).not.toContain("Mano de P2");
  });
});
