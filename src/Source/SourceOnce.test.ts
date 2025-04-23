import { expect, test, vitest } from "vitest";
import { sourceOnce } from "./SourceOnce";

test("SourceOnce.test", () => {
  const source = sourceOnce(123);
  source.give(321);
  const g = vitest.fn();
  source.value(g);
  expect(g).toBeCalledWith(123);
});
