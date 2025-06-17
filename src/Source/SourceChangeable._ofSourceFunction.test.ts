import { expect, test, vitest } from "vitest";
import { give } from "../Guest/Guest";
import { sourceOf } from "./SourceChangeable";
import { sourceSync } from "../Source/SourceSync";
import { patronPoolsStatistic } from "../Patron/PatronPool";

test("SourceChangeable._ofSourceFunction.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const source = sourceOf((g) => give(50, g));

  const g = vitest.fn();
  source.value(g);
  expect(g).toBeCalledWith(50);
});
