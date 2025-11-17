import { describe, expect, test, vi } from "vitest";
import { Of } from "base/Of";
import { Any } from "components/Any";
import { Late } from "components/Late";
import { Tap } from "base/Tap";

describe("Any.test", () => {
  test("message what responds from any connected message", () => {
    const l = Late<number>();
    const d = Of("default");

    const anyI = Any<string | number>(l, d);

    const o = vi.fn();
    anyI.pipe(Tap(o));

    expect(o).toHaveBeenCalledWith("default");

    l.use(999);

    expect(o).toBeCalledWith(999);
  });

  test("message what responds from any connected raw values", () => {
    const anyI = Any<string | number>(999, "default");

    const o = vi.fn();
    anyI.pipe(Tap(o));

    expect(o).toHaveBeenCalledWith("default");
  });
});
