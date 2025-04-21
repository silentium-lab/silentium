import { expect, test } from "vitest";
import { SourceSync } from "../Source/SourceSync";
import { sourceChangeable } from "./SourceChangeable";

test("SourceSync.test", () => {
  const source = sourceChangeable("hello");
  const syncSource = new SourceSync(source);

  expect(syncSource.syncValue()).toBe("hello");
});
