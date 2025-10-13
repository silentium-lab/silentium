import { Of } from "../base";
import { DataType, DataUserType } from "../types";
import { expect, test, vitest } from "vitest";
import { Map } from "../components/Map";

function x2(baseNumber: DataType<number>) {
  return (o: DataUserType<number>) => {
    baseNumber((v) => {
      o(v * 2);
    });
  };
}

test("Map._fn.test", () => {
  const info = Of([1, 2, 3, 9]);
  const infoMapped = Map(info, x2);
  const g = vitest.fn();
  infoMapped(g);
  expect(g).toBeCalledWith([2, 4, 6, 18]);
});
