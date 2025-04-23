import { expect, test, vitest } from "vitest";
import { guest } from "../Guest/Guest";
import { source, value } from "../Source/Source";

test("Guest.test", () => {
  const one = source(1);

  const guest1 = vitest.fn();
  value(one, guest1);
  expect(guest1).toBeCalledWith(1);

  const guest2 = vitest.fn();
  value(one, guest(guest2));
  expect(guest2).toBeCalledWith(1);
});
