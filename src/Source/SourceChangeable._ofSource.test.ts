import { expect, test, vitest } from "vitest";
import { patron } from "../Patron/Patron";
import { sourceOf } from "./SourceChangeable";
import { sourceSync } from "../Source/SourceSync";
import { patronPoolsStatistic } from "../Patron/PatronPool";

test("SourceChangeable._ofSource.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const source = sourceOf<number>(52);

  const g = vitest.fn();
  source.value(patron(g));
  expect(g).toBeCalledWith(52);

  source.give(33);
  expect(g).toBeCalledWith(33);
});
