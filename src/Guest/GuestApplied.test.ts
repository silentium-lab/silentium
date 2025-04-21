import { GuestApplied } from "../Guest/GuestApplied";
import { expect, test, vitest } from "vitest";
import { sourceChangeable } from "../Source/SourceChangeable";

test("GuestApplied.test", () => {
  const one = sourceChangeable(1);
  const guest = vitest.fn();

  one.value(new GuestApplied(guest, (v) => v * 2));

  expect(guest).toBeCalled();
  expect(guest).toBeCalledWith(2);
});
