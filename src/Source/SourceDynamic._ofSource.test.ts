import { sourceDynamic } from "./SourceDynamic";
import { sourceOf } from "./SourceChangeable";
import { expect, test, vitest } from "vitest";
import { sourceSync } from "../Source/SourceSync";
import {
  destroyFromSubSource,
  patronPoolsStatistic,
} from "../Patron/PatronPool";

test("SourceDynamic._ofSource.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const source = sourceOf(1);
  const sd = sourceDynamic<number>(source, source);

  const g1 = vitest.fn();
  sd.value(g1);
  expect(g1).toBeCalledWith(1);

  sd.give(2);

  const g2 = vitest.fn();
  sd.value(g2);
  expect(g2).toBeCalledWith(2);
  const g3 = vitest.fn();
  source.value(g3);
  expect(g3).toBeCalledWith(2);

  destroyFromSubSource(source, sd, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
