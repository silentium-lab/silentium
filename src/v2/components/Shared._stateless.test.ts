import { expect, test, vi } from "vitest";
import { of } from "./Of";
import { sharedStateless } from "./Shared";

test("Shared._stateless.test", () => {
  const [os, og] = of<number>(1);
  const [p] = sharedStateless(os);

  const g = vi.fn();
  p(g);
  og(1);
  expect(g).toBeCalledWith(1);

  const g2 = vi.fn();
  p(g2);
  expect(g2).not.toHaveBeenCalled();

  og(2);

  expect(g).toBeCalledWith(2);
  expect(g2).toBeCalledWith(2);
});
