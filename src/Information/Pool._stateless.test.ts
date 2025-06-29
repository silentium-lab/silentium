import { expect, test, vi } from "vitest";
import { O } from "../Owner";
import { of } from "./Of";
import { poolStateless } from "./Pool";

test("Pool._stateless.test", () => {
  const [os, og] = of<number>(1);
  const [p] = poolStateless(os);

  const g = vi.fn();
  p.value(O(g));
  og.give(1);
  expect(g).toBeCalledWith(1);

  const g2 = vi.fn();
  p.value(O(g2));
  expect(g2).not.toHaveBeenCalled();
});
