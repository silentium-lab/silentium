import { expect, test, vitest } from "vitest";
import { sourceChangeable } from "./SourceChangeable";

test("SourceChangeable.test", () => {
  const source = sourceChangeable(42);

  const g = vitest.fn();
  source.value(g);
  expect(g).toBeCalledWith(42);
});
