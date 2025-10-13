import { describe, expect, test, vi } from "vitest";
import { Of } from "../base";
import { Applied } from "./Applied";

describe("Applied.test", () => {
  test("event with applied function", () => {
    const info = Of(2);
    const infoDouble = Applied(info, (x) => x * 2);

    const g = vi.fn();
    infoDouble(g);

    expect(g).toBeCalledWith(4);
  });
});
