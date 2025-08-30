import { expect, test, vi } from "vitest";
import { Late } from "./Late";
import { LazyApplied } from "./LazyApplied";
import { From, Lazy, Of } from "../base";
import { Chain } from "./Chain";

test("LazyApplied.test", () => {
  const l = new Late();
  const lazyInf = new LazyApplied(new Lazy((v) => v), (i) => new Chain(l, i));
  const inf = lazyInf.get(new Of(1));

  const g = vi.fn();
  inf.value(new From(g));

  expect(g).not.toHaveBeenCalled();

  l.give(1);

  expect(g).toHaveBeenCalledTimes(1);
  expect(g).toBeCalledWith(1);
});
