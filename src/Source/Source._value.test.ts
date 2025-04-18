import { GuestSync } from "../Guest/GuestSync";
import { expect, test } from "vitest";

test("Source._value.test", () => {
  const g = new GuestSync(111);
  expect(g.value()).toBe(111);
});
