import { expect, test, vi } from "vitest";
import { sharedSource } from "../components/SharedSource";
import { late } from "./Late";

test("SharedSource._main.test", () => {
  const s = sharedSource(late<number>(1), true);

  const g = vi.fn();
  s.value(g);
  s.give(1);

  expect(g).toBeCalledWith(1);

  const g2 = vi.fn();
  s.value(g2);
  expect(g2).not.toHaveBeenCalled();

  s.give(2);

  expect(g).toBeCalledWith(2);
  expect(g2).toBeCalledWith(2);
});
