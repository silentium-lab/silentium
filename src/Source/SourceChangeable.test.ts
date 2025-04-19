import { expect, test, vitest } from "vitest";
import { SourceChangeable } from "./SourceChangeable";

test("SourceChangeable.test", () => {
  const source = new SourceChangeable(42);

  const g = vitest.fn();
  source.value(g);
  expect(g).toBeCalledWith(42);
});
