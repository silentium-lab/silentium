import { value } from "../Source/Source";
import { sourceAll } from "../Source/SourceAll";
import { expect, test, vi } from "vitest";

test("SourceAll._primitives.test", () => {
  const one = 1;
  const two = 2;
  const all = sourceAll<{ one: number; two: number }>({
    one,
    two,
  });

  const g = vi.fn();
  value(all, g);

  expect(g).toBeCalledWith({
    one: 1,
    two: 2,
  });
});
