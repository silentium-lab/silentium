import { expect, test, vi } from "vitest";
import { lazyChain } from "./LazyChain";
import { of } from "./Of";
import { i } from "./Information";

test("LazyChain.test", () => {
  const [chainInf, chainOwn] = of();
  const lazyInf = lazyChain((v) => i(v), chainInf);
  const inf = lazyInf(1);

  const g = vi.fn();
  inf(g);

  expect(g).not.toHaveBeenCalled();

  chainOwn(1);

  expect(g).toHaveBeenCalledTimes(1);
  expect(g).toBeCalledWith(1);
});
