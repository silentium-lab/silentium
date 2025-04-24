import { expect, test } from "vitest";
import { value } from "../Source/Source";
import { sourceChangeable } from "../Source/SourceChangeable";
import { sourceSync } from "../Source/SourceSync";
import { patron } from "./Patron";
import { destroy, patronPoolsStatistic, subSourceMany } from "./PatronPool";

test("PatronPool.subSourceMany.test", () => {
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

  const subSrc = sourceChangeable(222);
  subSourceMany(subSrc, [src]);

  expect(statistic.syncValue().patronsCount).toBe(1);
  expect(statistic.syncValue().poolsCount).toBe(2);

  // sub sources will be destroyed together with src
  destroy([src]);

  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
