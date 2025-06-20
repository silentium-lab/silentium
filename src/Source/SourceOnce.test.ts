import { expect, test, vitest } from "vitest";
import { destroy, patronPoolsStatistic } from "../Guest/PatronPool";
import { sourceSync } from "../Source/SourceSync";
import { sourceOnce } from "./SourceOnce";

test("SourceOnce.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const source: any = sourceOnce<number>(123);
  source.give(321);

  const g = vitest.fn();
  source.value(g);
  expect(g).toBeCalledWith(123);

  destroy(source);
  destroy(statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
  // const statisticLeak = new LeakDetector(statistic);
  // statistic = null;
  // expect(await statisticLeak.isLeaking()).toBe(false);
  // const sourceLeak = new LeakDetector(source);
  // source = null;
  // expect(await sourceLeak.isLeaking()).toBe(false);
});
