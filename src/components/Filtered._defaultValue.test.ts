import { expect, test, vitest } from "vitest";
import { of } from "../base";
import { filtered } from "./Filtered";

test("Filtered._defaultValue.test", () => {
  const info = filtered(of(11), (v) => v === 11);

  const g1 = vitest.fn();
  info(g1);
  expect(g1).toBeCalledWith(11);

  const info2 = filtered(of(11), (v) => v === 22, 33);

  const g2 = vitest.fn();
  info2(g2);
  expect(g2).toBeCalledWith(33);
});
