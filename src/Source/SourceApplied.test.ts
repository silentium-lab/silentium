import { expect, test } from "vitest";
import {
  destroyFromSubSource,
  patronPoolsStatistic,
} from "../Patron/PatronPool";
import { sourceApplied } from "../Source/SourceApplied";
import { sourceSync } from "../Source/SourceSync";
import { sourceOf } from "./SourceChangeable";

test("SourceApplied.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const source = sourceOf(1);
  const sourceDouble = sourceSync(sourceApplied(source, (x) => x * 2));
  expect(sourceDouble.syncValue()).toBe(2);

  destroyFromSubSource(source, sourceDouble, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
