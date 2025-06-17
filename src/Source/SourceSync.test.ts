import { expect, test } from "vitest";
import { sourceSync } from "../Source/SourceSync";
import { sourceOf } from "./SourceChangeable";
import { patronPoolsStatistic } from "../Patron/PatronPool";

test("SourceSync.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const source = sourceOf("hello");
  const syncSource = sourceSync(source);
  expect(syncSource.syncValue()).toBe("hello");
});
