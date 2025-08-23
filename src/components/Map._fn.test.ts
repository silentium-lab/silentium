import { From, Lazy, Of, OfFunc, TheInformation, TheOwner } from "../base";
import { expect, test, vitest } from "vitest";
import { Map } from "./Map";

function x2(baseNumber: TheInformation<number>) {
  return new OfFunc((o: TheOwner<number>) => {
    baseNumber.value(
      new From((v) => {
        o.give(v * 2);
      }),
    );
  });
}

test("Map._fn.test", () => {
  const info = new Of([1, 2, 3, 9]);
  const infoMapped = new Map(info, new Lazy(x2));
  const g = vitest.fn();
  infoMapped.value(new From(g));
  expect(g).toBeCalledWith([2, 4, 6, 18]);
});
