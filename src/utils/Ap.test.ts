import { ap } from "../utils/Ap";
import { expect, test, vi } from "vitest";
import { O } from "../Owner";
import { all } from "../Information/All";

test("Ap.test", () => {
  const a = ap(all, 1, 2);

  const o = vi.fn();
  a.value(O(o));

  expect(o).toBeCalledWith([1, 2]);
});
