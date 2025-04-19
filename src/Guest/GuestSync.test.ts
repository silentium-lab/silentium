import { expect, test } from "vitest";
import { GuestSync } from "./GuestSync";
import { SourceChangeable } from "../Source/SourceChangeable";

test("GuestSync.test", () => {
  const source = new SourceChangeable(123);
  const syncGuest = new GuestSync(111);
  syncGuest.give(222);
  expect(syncGuest.value()).toBe(222);
  source.value(syncGuest);
  expect(syncGuest.value()).toBe(123);
});
