import { expect, test, vitest } from "vitest";
import { patron } from "../Patron/Patron";
import { sourceOf } from "./SourceChangeable";
import { sourceSync } from "../Source/SourceSync";
import {
  destroyFromSubSource,
  patronPoolsStatistic,
} from "../Patron/PatronPool";

test("SourceChangeable._ofSource.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const source = sourceOf<number>(52);

  const g = vitest.fn();
  source.value(patron(g));
  expect(g).toBeCalledWith(52);

  source.give(33);
  expect(g).toBeCalledWith(33);

  destroyFromSubSource(source, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
