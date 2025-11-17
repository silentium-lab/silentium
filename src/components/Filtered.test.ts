import { describe, expect, test, vitest } from "vitest";
import { Filtered } from "components/Filtered";
import { Tap } from "base/Tap";
import { Of } from "base/Of";

describe("Filtered.test", () => {
  test("filtered main process", () => {
    const info = Filtered(Of(11), (v) => v === 11);

    const g1 = vitest.fn();
    info.pipe(Tap(g1));
    expect(g1).toBeCalledWith(11);

    const info2 = Filtered(Of(11), (v) => v === 22);

    const g2 = vitest.fn();
    info2.pipe(Tap(g2));
    expect(g2).not.toHaveBeenCalled();
  });

  test("filtered value", () => {
    const info = Filtered(11, (v) => v === 11);

    const g1 = vitest.fn();
    info.pipe(Tap(g1));
    expect(g1).toBeCalledWith(11);

    const info2 = Filtered(Of(11), (v) => v === 22);

    const g2 = vitest.fn();
    info2.pipe(Tap(g2));
    expect(g2).not.toHaveBeenCalled();
  });

  test("filtering with default value", () => {
    const info = Filtered(Of(11), (v) => v === 11);

    const g1 = vitest.fn();
    info.pipe(Tap(g1));
    expect(g1).toBeCalledWith(11);

    const info2 = Filtered(Of(11), (v) => v === 22, 33);

    const g2 = vitest.fn();
    info2.pipe(Tap(g2));
    expect(g2).toBeCalledWith(33);
  });
});
