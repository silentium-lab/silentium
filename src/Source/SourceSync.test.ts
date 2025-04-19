import { SourceSync } from "../Source/SourceSync";
import { SourceChangeable } from "./SourceChangeable";
import { expect, test } from "vitest";

test("SourceSync.test", () => {
  const source = new SourceChangeable("hello");
  const syncSource = new SourceSync(source);

  expect(syncSource.syncValue()).toBe("hello");
});
