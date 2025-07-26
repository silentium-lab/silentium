import { expect, test, vitest } from "vitest";
import { map } from "./Map";
import { InformationType, OwnerType } from "../types";
import { i } from "./Information";

function x2(baseNumber: InformationType<number>) {
  return (o: OwnerType<number>) => {
    baseNumber((v) => {
      o(v * 2);
    });
  };
}

test("Map._fn.test", () => {
  const info = i([1, 2, 3, 9]);
  const infoMapped = map(info, x2);
  const g = vitest.fn();
  infoMapped(g);
  expect(g).toBeCalledWith([2, 4, 6, 18]);
});
