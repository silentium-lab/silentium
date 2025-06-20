import { patronApplied } from "./PatronApplied";
import { value } from "../Source/Source";
import { expect, test, vi } from "vitest";
import { sourceOf } from "../Source/SourceChangeable";

test("PatronApplied.test", () => {
  const src = sourceOf<number>(1);
  const g = vi.fn();

  const patron = patronApplied(g, (v: number) => v * 2);
  value(src, patron);

  expect(g).toBeCalledWith(2);

  src.give(3);

  expect(g).toBeCalledWith(6);
});
