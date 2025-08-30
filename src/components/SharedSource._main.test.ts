import { expect, test, vi } from "vitest";
import { Late } from "./Late";
import { From } from "../base";
import { SharedSource } from "../components/SharedSource";

test("SharedSource._main.test", () => {
  const s = new SharedSource(new Late<number>(1), true);

  const g = vi.fn();
  s.value(new From(g));
  s.give(1);

  expect(g).toBeCalledWith(1);

  const g2 = vi.fn();
  s.value(new From(g2));
  expect(g2).not.toHaveBeenCalled();

  s.give(2);

  expect(g).toBeCalledWith(2);
  expect(g2).toBeCalledWith(2);
});
