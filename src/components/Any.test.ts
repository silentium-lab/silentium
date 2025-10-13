import { describe, expect, test, vi } from "vitest";
import { Of } from "../base/Of";
import { Any } from "./Any";
import { Late } from "./Late";

describe("Any.test", () => {
  test("event what responds from any connected event", () => {
    const l = Late<number>();
    const d = Of("default");

    const anyI = Any<string | number>(l.event, d);

    const o = vi.fn();
    anyI(o);

    expect(o).toHaveBeenCalledWith("default");

    l.use(999);

    expect(o).toBeCalledWith(999);
  });
});
