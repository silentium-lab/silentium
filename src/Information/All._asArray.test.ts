import { expect, test, vi } from "vitest";
import { I } from "./Information";
import { all } from "./All";
import { O } from "../Owner";

test("All._asArray.test", () => {
  const one = I(1);
  const two = I(2);
  const a = all(one, two);

  const o = vi.fn();
  a.value(O(o));

  expect(o).toBeCalledWith([1, 2]);
});
