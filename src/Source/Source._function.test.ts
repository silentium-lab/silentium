import { source } from "../Source/Source";
import { expect, test } from "vitest";
import { sourceSync } from "./SourceSync";

test("Source._function.test", () => {
  const src = sourceSync(source(111));
  expect(src.syncValue()).toBe(111);
});
