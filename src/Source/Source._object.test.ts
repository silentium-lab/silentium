import { source } from "../Source/Source";
import { expect, test } from "vitest";
import { SourceSync } from "./SourceSync";

test("Source._object.test", () => {
  const src = new SourceSync({
    value: source(111),
  });
  expect(src.syncValue()).toBe(111);
});
