import { expect, test, vitest } from "vitest";
import { patron } from "../Patron/Patron";
import { sourceChangeable } from "./SourceChangeable";

test("SourceChangeable._empty.test", () => {
  const source = sourceChangeable();
  const guest = vitest.fn();

  source.value(patron(guest));
  source.give(42);

  expect(guest).toBeCalled();
  expect(guest).toBeCalledWith(42);
});
