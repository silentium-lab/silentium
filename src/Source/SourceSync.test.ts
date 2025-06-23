import { S } from "../Source/Source";
import { expect, test } from "vitest";
import { sync } from "../Source/SourceSync";

test("SourceSync.test", () => {
  const source = S("hello");
  const syncSource = sync(source);
  expect(syncSource.syncValue()).toBe("hello");
});
