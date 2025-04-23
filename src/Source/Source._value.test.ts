import { expect, test } from "vitest";
import { guestSync } from "../Guest/GuestSync";

test("Source._value.test", () => {
  const g = guestSync(111);
  expect(g.value()).toBe(111);
});
