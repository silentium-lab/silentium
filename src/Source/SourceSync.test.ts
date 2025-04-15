import { SourceSync } from "../Source/SourceSync";
import { SourceWithPool } from "../Source/SourceWithPool";
import { expect, test } from "vitest";

test("SourceSync.test", () => {
  const source = new SourceWithPool("hello");
  const syncSource = new SourceSync(source);

  expect(syncSource.syncValue()).toBe("hello");
});
