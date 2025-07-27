import { expect, test, vitest } from "vitest";
import { filtered } from "./Filtered";
import { i } from "./Information";

test("Filtered.test", () => {
  const info = filtered(i(11), (v) => v === 11);

  const g1 = vitest.fn();
  info(g1);
  expect(g1).toBeCalledWith(11);

  const info2 = filtered(i(11), (v) => v === 22);

  const g2 = vitest.fn();
  info2(g2);
  expect(g2).not.toHaveBeenCalled();
});
