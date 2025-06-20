import {
  destroyFromSubSource,
  patronPoolsStatistic,
} from "../Guest/PatronPool";
import { value } from "../Source/Source";
import { sourceOf } from "../Source/SourceChangeable";
import { sourceResettable } from "../Source/SourceResettable";
import { sourceSync } from "../Source/SourceSync";
import { expect, test, vi } from "vitest";

test("SourceFiltered.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const resetSrc = sourceOf();
  const baseSrc = sourceOf<number>(1);
  const resettable = sourceResettable(baseSrc, resetSrc);
  const resettableSync = sourceSync(resettable);

  expect(resettableSync.syncValue()).toBe(1);

  resetSrc.give(1);

  const g1 = vi.fn();
  value(resettable, g1);
  expect(g1).not.toBeCalled();

  baseSrc.give(2);
  const g2 = vi.fn();
  value(resettable, g2);
  expect(g2).toBeCalledWith(2);

  destroyFromSubSource(resetSrc, baseSrc, resettable, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
