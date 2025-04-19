import { expect, test, vitest } from "vitest";
import { SourceChangeable } from "./SourceChangeable";
import { Patron } from "../Patron/Patron";

test("SourceChangeable.test", () => {
  const source = new SourceChangeable();
  const guest = vitest.fn();

  source.value(new Patron(guest));
  source.give(42);

  expect(guest).toBeCalled();
  expect(guest).toBeCalledWith(42);
});
