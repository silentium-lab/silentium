import { expect, test, vitest } from "vitest";
import { give, Guest } from "../Guest/Guest";
import { sourceDynamic } from "./SourceDynamic";

test("SourceDynamic", () => {
  let theValue = 1;
  const sd = sourceDynamic(
    new Guest((value: number) => {
      theValue = value;
    }),
    (g) => give(theValue, g),
  );

  const g1 = vitest.fn();
  sd.value(g1);
  expect(g1).toBeCalledWith(1);

  sd.give(2);

  const g2 = vitest.fn();
  sd.value(g2);
  expect(g2).toBeCalledWith(2);
});
