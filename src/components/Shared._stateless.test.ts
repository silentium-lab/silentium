import { expect, test, vi } from "vitest";
import { late } from "./Late";
import { shared } from "./Shared";

test("Shared._stateless.test", () => {
  const l = late<number>(1);
  const s = shared(l.value, true);

  const g = vi.fn();
  s.value(g);
  l.give(1);

  expect(g).toBeCalledWith(1);

  const g2 = vi.fn();
  s.value(g2);
  expect(g2).not.toHaveBeenCalled();

  l.give(2);

  expect(g).toBeCalledWith(2);
  expect(g2).toBeCalledWith(2);
});
