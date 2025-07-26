import { expect, test, vi } from "vitest";
import { i } from "./Information";
import { all } from "./All";

test("All.test", () => {
  const one = i(1);
  const two = i(2);
  const a = all(one, two);

  const o = vi.fn();
  a(o);

  expect(o).toBeCalledWith([1, 2]);
});
