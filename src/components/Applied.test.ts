import { describe, expect, test, vi } from "vitest";
import { of } from "../base";
import { applied } from "./Applied";

describe("Applied.test", () => {
  test("event with applied function", () => {
    const info = of(2);
    const infoDouble = applied(info, (x) => x * 2);

    const g = vi.fn();
    infoDouble(g);

    expect(g).toBeCalledWith(4);
  });
});
