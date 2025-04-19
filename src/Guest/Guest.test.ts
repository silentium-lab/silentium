import { expect, test, vitest } from "vitest";
import { SourceChangeable } from "../Source/SourceChangeable";
import { Guest } from "../Guest/Guest";

test("Guest.test", () => {
  const one = new SourceChangeable(1);

  const guest1 = vitest.fn();
  one.value(guest1);
  expect(guest1).toBeCalledWith(1);

  const guest2 = vitest.fn();
  one.value(new Guest(guest2));
  expect(guest2).toBeCalledWith(1);
});
