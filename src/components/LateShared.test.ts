import { expect, test, vi } from "vitest";
import { lateShared } from "../components/LateShared";

test("LateShared.test", () => {
  const l = lateShared<number>();

  const o = vi.fn();
  l.value(o);

  const o2 = vi.fn();
  l.value(o2);

  expect(o).not.toHaveBeenCalled();
  expect(o2).not.toHaveBeenCalled();

  l.give(1);

  expect(o).toHaveBeenCalledWith(1);
  expect(o2).toHaveBeenCalledWith(1);

  l.give(2);

  expect(o).toHaveBeenCalledWith(1);
  expect(o2).toHaveBeenCalledWith(1);
});
