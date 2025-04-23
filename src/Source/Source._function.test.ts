import { expect, test } from "vitest";
import { give } from "../Guest/Guest";
import { sourceSync } from "./SourceSync";

test("Source._function.test", () => {
  const src = sourceSync(give(111));
  expect(src.syncValue()).toBe(111);
});
