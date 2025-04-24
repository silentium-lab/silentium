import { sourceChangeable } from "../Source/SourceChangeable";
import { expect, test } from "vitest";
import { patron } from "../Patron/Patron";
import { value } from "../Source/Source";
import { sourceSync } from "../Source/SourceSync";
import { destroy, patronPoolsStatistic, subSource } from "./PatronPool";

test("PatronPool.subSource.test", () => {
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
  subSource(src, subSrc);

  expect(statistic.syncValue().patronsCount).toBe(1);
  expect(statistic.syncValue().poolsCount).toBe(2);

  // sub sources will be destroyed together with src
  destroy([src]);

  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
