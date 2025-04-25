import { expect, test } from "vitest";
import { sourceApplied } from "../Source/SourceApplied";
import { sourceSync } from "../Source/SourceSync";
import { sourceOf } from "./SourceChangeable";

test("SourceApplied.test", () => {
  const source = sourceOf(1);
  const sourceDouble = sourceSync(sourceApplied(source, (x) => x * 2));
  expect(sourceDouble.syncValue()).toBe(2);
});
