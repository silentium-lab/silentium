import { value } from "../Source/Source";
import { sourceAll } from "../Source/SourceAll";
import { expect, test, vi } from "vitest";

test("SourceAll._primitives.test", () => {
  const one = 1;
  const two = 2;
  const all = sourceAll([one, two]);

  const g = vi.fn();
  value(all, g);

  expect(g).toBeCalledWith([1, 2]);
});
