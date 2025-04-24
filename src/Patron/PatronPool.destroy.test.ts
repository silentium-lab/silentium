import { value } from "../Source/Source";
import { sourceChangeable } from "../Source/SourceChangeable";
import { sourceSync } from "../Source/SourceSync";
import { expect, test } from "vitest";
import { patron } from "./Patron";
import { destroy, patronPoolsStatistic } from "./PatronPool";

test("PatronPool.destroy.test", () => {
  const statistic = sourceSync(patronPoolsStatistic);

  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);

  const src = sourceChangeable(111);
  value(
    src,
    patron(() => {}),
  );

  expect(statistic.syncValue().patronsCount).toBe(1);
  expect(statistic.syncValue().poolsCount).toBe(1);

  destroy([src]);

  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
