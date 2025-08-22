import { expect, test, vitest } from "vitest";
import { Filtered } from "./Filtered";
import { From, Of } from "../base";

test("Filtered.test", () => {
  const info = new Filtered(new Of(11), (v) => v === 11);

  const g1 = vitest.fn();
  info.value(new From(g1));
  expect(g1).toBeCalledWith(11);

  const info2 = new Filtered(new Of(11), (v) => v === 22);

  const g2 = vitest.fn();
  info2.value(new From(g2));
  expect(g2).not.toHaveBeenCalled();
});
