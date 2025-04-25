import { expect, test } from "vitest";
import { sourceSync } from "../Source/SourceSync";
import { sourceOf } from "./SourceChangeable";

test("SourceSync.test", () => {
  const source = sourceOf("hello");
  const syncSource = sourceSync(source);
  expect(syncSource.syncValue()).toBe("hello");
});
