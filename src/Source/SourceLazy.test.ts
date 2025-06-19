import { expect, test, vi } from "vitest";
import { lazy } from "../Lazy/Lazy";
import {
  destroyFromSubSource,
  patronPoolsStatistic,
} from "../Patron/PatronPool";
import { SourceType } from "../Source/Source";
import { sourceApplied } from "../Source/SourceApplied";
import { sourceOf } from "../Source/SourceChangeable";
import { sourceLazy } from "../Source/SourceLazy";
import { sourceSync } from "../Source/SourceSync";

test("SourceLazy.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const resetSrc = sourceOf();
  const lazySrc = lazy((baseSrc: SourceType<number>) =>
    sourceApplied(baseSrc, (x) => x * 2),
  );

  const valueSrc = sourceOf<number>(2);
  const twiceSrc = sourceSync(sourceLazy(lazySrc, [valueSrc], resetSrc));

  expect(twiceSrc.syncValue()).toBe(4);

  valueSrc.give(6);

  expect(twiceSrc.syncValue()).toBe(12);

  resetSrc.give(1);

  const g = vi.fn();
  twiceSrc.value(g);
  expect(g).not.toHaveBeenCalled();

  valueSrc.give(3);
  twiceSrc.value(g);
  expect(g).toHaveBeenCalledWith(6);

  destroyFromSubSource(resetSrc, lazySrc, valueSrc, twiceSrc, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
