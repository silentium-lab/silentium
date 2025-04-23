import { expect, test } from "vitest";
import { sourceChangeable } from "../Source/SourceChangeable";
import { guestSync } from "./GuestSync";

test("GuestSync.test", () => {
  const source = sourceChangeable(123);
  const syncGuest = guestSync(111);
  syncGuest.give(222);
  expect(syncGuest.value()).toBe(222);
  source.value(syncGuest);
  expect(syncGuest.value()).toBe(123);
});
