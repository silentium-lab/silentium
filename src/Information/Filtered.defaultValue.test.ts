import { O } from "../Owner";
import { expect, test, vitest } from "vitest";
import { I } from "./Information";
import { filtered } from "./Filtered";

test("Filtered.defaultValue.test", () => {
  const info = filtered(I(11), (v) => v === 11);

  const g1 = vitest.fn();
  info.value(O(g1));
  expect(g1).toBeCalledWith(11);

  const info2 = filtered(I(<number>11), (v) => v === 22, 33);

  const g2 = vitest.fn();
  info2.value(O(g2));
  expect(g2).toBeCalledWith(33);
});
