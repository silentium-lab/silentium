import { G } from "../Guest/Guest";
import { expect, test, vitest } from "vitest";
import { appliedG } from "../Guest/GuestApplied";
import { S } from "../Source/Source";

test("GuestApplied.test", () => {
  const one = S(23);
  const guest = vitest.fn();

  one.value(appliedG(G(guest), (v) => v * 2));

  expect(guest).toBeCalled();
  expect(guest).toBeCalledWith(46);
});
