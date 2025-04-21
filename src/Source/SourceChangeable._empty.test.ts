import { expect, test, vitest } from "vitest";
import { sourceChangeable } from "./SourceChangeable";
import { Patron } from "../Patron/Patron";

test("SourceChangeable._empty.test", () => {
  const source = sourceChangeable();
  const guest = vitest.fn();

  source.value(new Patron(guest));
  source.give(42);

  expect(guest).toBeCalled();
  expect(guest).toBeCalledWith(42);
});
