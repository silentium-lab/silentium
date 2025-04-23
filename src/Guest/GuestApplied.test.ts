import { expect, test, vitest } from "vitest";
import { guestApplied } from "../Guest/GuestApplied";
import { source, value } from "../Source/Source";

test("GuestApplied.test", () => {
  const one = source(1);
  const guest = vitest.fn();

  value(
    one,
    guestApplied(guest, (v) => v * 2),
  );

  expect(guest).toBeCalled();
  expect(guest).toBeCalledWith(2);
});
