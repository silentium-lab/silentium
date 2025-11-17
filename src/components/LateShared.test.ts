import { describe, expect, test, vi } from "vitest";
import { LateShared } from "components/LateShared";
import { Tap } from "base/Tap";

describe("LateShared.test", () => {
  test("without value", () => {
    const l = LateShared<number>();

    const o = vi.fn();
    l.pipe(Tap(o));

    const o2 = vi.fn();
    l.pipe(Tap(o2));

    expect(o).not.toHaveBeenCalled();
    expect(o2).not.toHaveBeenCalled();

    l.use(1);

    expect(o).toHaveBeenLastCalledWith(1);
    expect(o2).toHaveBeenLastCalledWith(1);

    l.use(2);

    expect(o).toHaveBeenLastCalledWith(2);
    expect(o2).toHaveBeenLastCalledWith(2);
  });

  test("with value", function LateSharedTest() {
    const l = LateShared<number>(1);

    l.use(2);

    const o = vi.fn();
    l.pipe(Tap(o));

    expect(o).toHaveBeenLastCalledWith(2);
  });

  test("primitive", () => {
    const l = LateShared<number>(1);
    expect(l.value().primitive()).toBe(1);
  });
});
