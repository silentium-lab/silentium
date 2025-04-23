import { expect, test, vitest } from "vitest";
import { patron } from "../Patron/Patron";
import { sourceChangeable } from "./SourceChangeable";

test("SourceChangeable._ofSource.test", () => {
  const source = sourceChangeable<number>(52);

  const g = vitest.fn();
  source.value(patron(g));
  expect(g).toBeCalledWith(52);

  source.give(33);
  expect(g).toBeCalledWith(33);
});
