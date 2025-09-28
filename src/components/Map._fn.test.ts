import { of } from "../base";
import { DataType, DataUserType } from "../types";
import { expect, test, vitest } from "vitest";
import { map } from "../components/Map";

function x2(baseNumber: DataType<number>) {
  return (o: DataUserType<number>) => {
    baseNumber((v) => {
      o(v * 2);
    });
  };
}

test("Map._fn.test", () => {
  const info = of([1, 2, 3, 9]);
  const infoMapped = map(info, x2);
  const g = vitest.fn();
  infoMapped(g);
  expect(g).toBeCalledWith([2, 4, 6, 18]);
});
