import { lazy } from "../Lazy/Lazy";
import { sourceApplied } from "../Source/SourceApplied";
import { sourceLazy } from "../Source/SourceLazy";
import { expect, test, vi } from "vitest";
import { SourceType } from "../Source/Source";
import { sourceSync } from "../Source/SourceSync";
import { sourceOf } from "../Source/SourceChangeable";
import { patronPoolsStatistic } from "../Patron/PatronPool";

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
});
