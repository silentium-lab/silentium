import { expect, test } from "vitest";
import { sourceChangeable } from "../Source/SourceChangeable";
import { patron } from "../Patron/Patron";

test("Patron.test", () => {
  const one = sourceChangeable<number>(1);
  let patronCalledTimes = 0;
  const p = patron(() => {
    patronCalledTimes += 1;
  });

  one.value(p);
  one.give(2);

  expect(patronCalledTimes).toBe(2);
});
