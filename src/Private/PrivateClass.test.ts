import { expect, test, vitest } from "vitest";
import { SourceChangeable } from "../Source/SourceChangeable";
import { PrivateClass } from "./PrivateClass";

test("PrivateClass.test", () => {
  const sourcePrivate = new PrivateClass(SourceChangeable);
  const source = sourcePrivate.get(42);

  const guest = vitest.fn();
  source.value(guest);

  expect(guest).toBeCalledWith(42);
});
