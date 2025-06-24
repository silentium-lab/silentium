import { O } from "./Owner";
import { expect, test, vitest } from "vitest";
import { ownerApplied } from "./OwnerApplied";
import { I } from "../Information/Information";

test("ownerApplied.test", () => {
  const one = I(23);
  const owner = vitest.fn();

  one.value(ownerApplied(O(owner), (v) => v * 2));

  expect(owner).toBeCalled();
  expect(owner).toBeCalledWith(46);
});
