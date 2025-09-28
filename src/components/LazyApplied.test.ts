import { expect, test, vi } from "vitest";
import { of } from "../base";
import { chain } from "../components/Chain";
import { late } from "../components/Late";
import { lazyApplied } from "../components/LazyApplied";

test("LazyApplied.test", () => {
  const l = late();
  const lazyInf = lazyApplied(
    (v) => v,
    (i) => chain(l.value, i),
  );
  const inf = lazyInf(of(1));

  const g = vi.fn();
  inf(g);

  expect(g).not.toHaveBeenCalled();

  l.give(1);

  expect(g).toHaveBeenCalledTimes(1);
  expect(g).toBeCalledWith(1);
});
