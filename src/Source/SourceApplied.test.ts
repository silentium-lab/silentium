import { SourceSync } from "../Source/SourceSync";
import { expect, test } from "vitest";
import { sourceApplied } from "../Source/SourceApplied";
import { sourceChangeable } from "./SourceChangeable";

test("SourceApplied.test", () => {
  const source = sourceChangeable(1);
  const sourceDouble = new SourceSync(sourceApplied(source, (x) => x * 2));

  expect(sourceDouble.syncValue()).toBe(2);
});
