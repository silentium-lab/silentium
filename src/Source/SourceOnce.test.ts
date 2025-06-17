import { expect, test, vitest } from "vitest";
import { sourceOnce } from "./SourceOnce";
import { destroy, patronPoolsStatistic } from "../Patron/PatronPool";
import { sourceSync } from "../Source/SourceSync";
import LeakDetector from "jest-leak-detector";

test("SourceOnce.test", async () => {
  let statistic: any = sourceSync(patronPoolsStatistic);
  let source: any = sourceOnce<number>(123);
  source.give(321);
  const g = vitest.fn();
  source.value(g);
  expect(g).toBeCalledWith(123);

  destroy(source);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
  destroy(statistic);
  const statisticLeak = new LeakDetector(statistic);
  statistic = null;
  expect(await statisticLeak.isLeaking()).toBe(false);
  const sourceLeak = new LeakDetector(source);
  source = null;
  expect(await sourceLeak.isLeaking()).toBe(false);
});
