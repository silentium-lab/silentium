import { GuestSync } from "../Guest/GuestSync";
import { SourceApplied } from "../Source/SourceApplied";
import { SourceChangeable } from "./SourceChangeable";
import { expect, test } from "vitest";

test("SourceApplied.test", () => {
  const source = new SourceChangeable(1);
  const sourceDouble = new SourceApplied(source, (x) => x * 2);
  const guest = new GuestSync(0);

  sourceDouble.value(guest);

  expect(guest.value()).toBe(2);
});
