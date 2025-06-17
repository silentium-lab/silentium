import { expect, test } from "vitest";
import { sourceApplied } from "../Source/SourceApplied";
import { sourceSync } from "../Source/SourceSync";
import { sourceOf } from "./SourceChangeable";
import { patronPoolsStatistic } from "../Patron/PatronPool";

test("SourceApplied.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const source = sourceOf(1);
  const sourceDouble = sourceSync(sourceApplied(source, (x) => x * 2));
  expect(sourceDouble.syncValue()).toBe(2);
});
