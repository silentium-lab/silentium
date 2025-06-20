import { patron } from "../Guest/Patron";
import { expect, test } from "vitest";
import { sourceMemoOf } from "./SourceChangeable";
import { sourceSync } from "../Source/SourceSync";
import {
  destroy,
  destroyFromSubSource,
  patronPoolsStatistic,
} from "../Guest/PatronPool";

test("SourceChangeable._memo.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const source = sourceMemoOf();
  let calledTimes = 0;
  source.value(
    patron(() => {
      calledTimes += 1;
    }),
  );

  source.give(1);
  source.give(1);
  source.give(1);
  source.give(2);
  source.give(2);
  source.give(2);
  source.give(2);
  source.give(2);
  source.give(2);

  expect(calledTimes).toBe(2);

  destroy(source);
  destroyFromSubSource(source, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
