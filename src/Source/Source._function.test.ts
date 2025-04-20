import { expect, test } from "vitest";
import { give } from "../Guest/Guest";
import { SourceSync } from "./SourceSync";

test("Source._function.test", () => {
  const sncsrc = new SourceSync(give(111));
  expect(sncsrc.syncValue()).toBe(111);
});
