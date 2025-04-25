import { expect, test, vitest } from "vitest";
import { sourceOf } from "./SourceChangeable";

test("SourceChangeable.test", () => {
  const source = sourceOf(42);

  const g = vitest.fn();
  source.value(g);
  expect(g).toBeCalledWith(42);
});
