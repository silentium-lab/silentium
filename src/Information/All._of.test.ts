import { expect, test, vi } from "vitest";
import { O } from "../Owner";
import { of } from "./Of";
import { all } from "./All";

test("All._of.test", () => {
  const [os, og] = of<number>(1);
  const [ts, tg] = of<number>(2);
  const a = all(os, ts);

  const g = vi.fn();
  a.value(O(g));

  expect(g).toBeCalledWith([1, 2]);

  og.give(3);
  tg.give(4);

  expect(g).toBeCalledWith([3, 4]);

  og.give(5);
  tg.give(6);

  expect(g).toBeCalledWith([5, 6]);
});
