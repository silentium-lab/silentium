import { expect, test } from "vitest";
import { source } from "../Source/Source";
import { sourceSync } from "./SourceSync";

test("Source._object.test", () => {
  const src = sourceSync({
    value: source(111),
  });
  expect(src.syncValue()).toBe(111);
});
