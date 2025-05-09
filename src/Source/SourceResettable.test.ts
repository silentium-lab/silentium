import { sourceOf } from "../Source/SourceChangeable";
import { sourceResettable } from "../Source/SourceResettable";
import { sourceSync } from "../Source/SourceSync";
import { expect, test, vi } from "vitest";

test("SourceFiltered.test", () => {
  const resetSrc = sourceOf();
  const baseSrc = sourceOf<number>(1);
  const resettable = sourceResettable(baseSrc, resetSrc);
  const resettableSync = sourceSync(resettable);

  expect(resettableSync.syncValue()).toBe(1);

  resetSrc.give(1);

  const g1 = vi.fn();
  resettable.value(g1);
  expect(g1).not.toBeCalled();

  baseSrc.give(2);
  const g2 = vi.fn();
  resettable.value(g2);
  expect(g2).toBeCalledWith(2);
});
