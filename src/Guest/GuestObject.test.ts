import { expect, test, vitest } from "vitest";
import { sourceChangeable } from "../Source/SourceChangeable";
import { GuestObject } from "./GuestObject";

test("GuestObject.test", () => {
  const source = sourceChangeable(1);
  const fnGuest = vitest.fn();
  source.value(new GuestObject(fnGuest));
  expect(fnGuest).toBeCalled();
  expect(fnGuest).toBeCalledWith(1);
});
