import { expect, test, vitest } from "vitest";
import { sourceOf } from "./SourceChangeable";
import { sourceSync } from "../Source/SourceSync";
import {
  destroyFromSubSource,
  patronPoolsStatistic,
} from "../Patron/PatronPool";

test("SourceChangeable.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const source = sourceOf(42);

  const g = vitest.fn();
  source.value(g);
  expect(g).toBeCalledWith(42);

  destroyFromSubSource(source, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
