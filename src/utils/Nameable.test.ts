import { sourceOf } from "../Source/SourceChangeable";
import { withName } from "../utils/Nameable";
import { expect, test } from "vitest";
import { sourceSync } from "../Source/SourceSync";

test("Nameable.test", () => {
  const testFn = () => "123";
  const namedTestFn = withName(testFn, "test");

  expect(namedTestFn()).toBe("123");
  expect(namedTestFn.name).toBe("test");

  const src = withName(sourceSync(sourceOf(1)), "src1");
  expect(src.name).toBe("src1");
  expect(src.syncValue()).toBe(1);
});
