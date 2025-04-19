import { expect, test } from "vitest";
import { Patron } from "./Patron";
import { SourceChangeable } from "../Source/SourceChangeable";

test("Patron.test", () => {
  const one = new SourceChangeable(1);
  let patronCalledTimes = 0;
  const patron = new Patron(() => {
    patronCalledTimes += 1;
  });

  one.value(patron);
  one.give(2);

  expect(patronCalledTimes).toBe(2);
});
