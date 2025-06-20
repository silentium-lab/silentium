import { source } from "../Source/Source";
import { expect, test } from "vitest";
import { sourceSync } from "./SourceSync";
import { destroy, patronPoolsStatistic } from "../Guest/PatronPool";

test("Source._function.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const src = sourceSync(source(111));
  expect(src.syncValue()).toBe(111);

  destroy(src);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
