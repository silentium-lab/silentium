import { expect, test, vitest } from "vitest";
import { O, Owner } from "../Owner/Owner";
import { lazy } from "../utils/Lazy";
import { I, Information } from "./Information";
import { map } from "./Map";

function x2(baseNumber: Information<number>) {
  return I((o: Owner<number>) => {
    baseNumber.value(
      O((v) => {
        o.give(v * 2);
      }),
    );
  });
}

test("Map._fn.test", () => {
  const info = I([1, 2, 3, 9]);
  const infoMapped = map(info, lazy(x2));
  const g = vitest.fn();
  infoMapped.value(O(g));
  expect(g).toBeCalledWith([2, 4, 6, 18]);
});
