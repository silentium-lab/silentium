import { describe, expect, test, vi } from "vitest";
import { lateShared } from "../components/LateShared";

describe("LateShared.test", () => {
  test("without value", () => {
    const l = lateShared<number>();

    const o = vi.fn();
    l.value(o);

    const o2 = vi.fn();
    l.value(o2);

    expect(o).not.toHaveBeenCalled();
    expect(o2).not.toHaveBeenCalled();

    l.give(1);

    expect(o).toHaveBeenLastCalledWith(1);
    expect(o2).toHaveBeenLastCalledWith(1);

    l.give(2);

    expect(o).toHaveBeenLastCalledWith(2);
    expect(o2).toHaveBeenLastCalledWith(2);
  });

  test("with value", function LateSharedTest() {
    const l = lateShared<number>(1);

    l.give(2);

    const o = vi.fn();
    l.value(o);

    expect(o).toHaveBeenLastCalledWith(2);
  });
});
