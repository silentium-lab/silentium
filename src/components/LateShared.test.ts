import { LateShared } from "../components/LateShared";
import { expect, test, vi } from "vitest";
import { From } from "../base";

test("LateShared.test", () => {
  const l = new LateShared<number>();

  const o = vi.fn();
  l.value(new From(o));

  const o2 = vi.fn();
  l.value(new From(o2));

  expect(o).not.toHaveBeenCalled();
  expect(o2).not.toHaveBeenCalled();

  l.give(1);

  expect(o).toHaveBeenCalledWith(1);
  expect(o2).toHaveBeenCalledWith(1);

  l.give(2);

  expect(o).toHaveBeenCalledWith(1);
  expect(o2).toHaveBeenCalledWith(1);
});
