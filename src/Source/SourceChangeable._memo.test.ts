import { patron } from "../Patron/Patron";
import { expect, test } from "vitest";
import { sourceMemoOf } from "./SourceChangeable";
import { sourceSync } from "../Source/SourceSync";
import { patronPoolsStatistic } from "../Patron/PatronPool";

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
});
