import { expect, test } from "vitest";
import { sourceSync } from "../Source/SourceSync";
import { sourceChangeable } from "./SourceChangeable";

test("SourceSync.test", () => {
  const source = sourceChangeable("hello");
  const syncSource = sourceSync(source);
  expect(syncSource.syncValue()).toBe("hello");
});
