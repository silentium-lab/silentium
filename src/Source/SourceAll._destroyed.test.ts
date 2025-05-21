import { expect, test } from "vitest";
import { destroy, patronPoolsStatistic } from "../Patron/PatronPool";
import { sourceAll } from "../Source/SourceAll";
import { sourceOf } from "../Source/SourceChangeable";
import { sourceSync } from "../Source/SourceSync";

test("SourceAll._destroyed.test", () => {
  const statistic = sourceSync(patronPoolsStatistic);
  const src1 = sourceOf<number>(1);
  const src2 = sourceOf<number>(2);
  const all = sourceAll([src1, src2]);
  const allSync = sourceSync(all);

  src1.give(3);
  src2.give(4);

  expect(allSync.syncValue()).toStrictEqual([3, 4]);

  expect(statistic.syncValue().patronsCount).toBe(3);
  expect(statistic.syncValue().poolsCount).toBe(3);

  destroy(all);
  destroy(allSync);

  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
