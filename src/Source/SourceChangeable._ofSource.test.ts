import { expect, test, vitest } from "vitest";
import { SourceChangeable } from "./SourceChangeable";
import { Patron } from "../Patron/Patron";

test("SourceChangeable._ofSource.test", () => {
  const source = new SourceChangeable(52);

  const g = vitest.fn();
  source.value(new Patron(g));
  expect(g).toBeCalledWith(52);

  source.give(33);
  expect(g).toBeCalledWith(33);
});
