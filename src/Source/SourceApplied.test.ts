import { SourceSync } from "../Source/SourceSync";
import { expect, test } from "vitest";
import { sourceApplied } from "../Source/SourceApplied";
import { SourceChangeable } from "./SourceChangeable";

test("SourceApplied.test", () => {
  const source = new SourceChangeable(1);
  const sourceDouble = new SourceSync(sourceApplied(source, (x) => x * 2));

  expect(sourceDouble.syncValue()).toBe(2);
});
