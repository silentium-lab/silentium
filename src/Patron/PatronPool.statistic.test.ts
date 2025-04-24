import { sourceChangeable } from "../Source/SourceChangeable";
import { sourceSync } from "../Source/SourceSync";
import { expect, test } from "vitest";
import { patron } from "./Patron";
import { patronPoolsStatistic } from "./PatronPool";

test("PatronPool.statistic.test", () => {
  const statistic = sourceSync(patronPoolsStatistic);

  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);

  const src = sourceChangeable(1);
  src.value(patron(() => {}));

  expect(statistic.syncValue().patronsCount).toBe(1);
  expect(statistic.syncValue().poolsCount).toBe(1);

  src.value(patron(() => {}));

  expect(statistic.syncValue().patronsCount).toBe(2);
  expect(statistic.syncValue().poolsCount).toBe(1);

  sourceChangeable(2);

  expect(statistic.syncValue().patronsCount).toBe(2);
  expect(statistic.syncValue().poolsCount).toBe(2);
});
