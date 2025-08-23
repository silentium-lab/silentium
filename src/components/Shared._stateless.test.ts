import { expect, test, vi } from "vitest";
import { Late } from "./Late";
import { Shared } from "./Shared";
import { From } from "../base";

test("Shared._stateless.test", () => {
  const l = new Late<number>(1);
  const s = new Shared(l, true);

  const g = vi.fn();
  s.value(new From(g));
  l.owner().give(1);

  expect(g).toBeCalledWith(1);

  const g2 = vi.fn();
  s.value(new From(g2));
  expect(g2).not.toHaveBeenCalled();

  l.owner().give(2);

  expect(g).toBeCalledWith(2);
  expect(g2).toBeCalledWith(2);
});
