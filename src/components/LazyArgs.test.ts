import { expect, test, vi } from "vitest";
import { of } from "../base";
import { lazyArgs } from "../components/LazyArgs";

test("LazyApplied.test", () => {
  const g = vi.fn();
  const p = lazyArgs((...a: unknown[]) => of(a), [2, 3], 2);
  p(1)(g);

  expect(g).toHaveBeenLastCalledWith([1, undefined, 2, 3]);

  p(1, 2)(g);

  expect(g).toHaveBeenLastCalledWith([1, 2, 2, 3]);

  p(1, 9, 11)(g);

  expect(g).toHaveBeenLastCalledWith([1, 9, 2, 3]);
});
