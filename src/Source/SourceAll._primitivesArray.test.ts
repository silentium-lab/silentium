import { value } from "./Source";
import { sourceAll } from "./SourceAll";
import { expect, test, vi } from "vitest";

test("SourceAll._primitivesArray.test", () => {
  const one = 1;
  const two = 2;
  const all = sourceAll([one, two]);

  const g = vi.fn();
  value(all, g);

  expect(g).toBeCalledWith([1, 2]);
});
