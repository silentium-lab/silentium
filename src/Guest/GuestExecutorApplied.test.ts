import { expect, test, vi } from "vitest";
import { debounce } from "../../test-utils/debounce";
import { guestExecutorApplied } from "../Guest/GuestExecutorApplied";
import { Patron } from "../Patron/Patron";
import { sourceChangeable } from "../Source/SourceChangeable";

test("GuestExecutorApplied.test", () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  let counter = 0;
  const guest = (v: number) => {
    counter += v;
  };

  const source = sourceChangeable();
  source.value(
    new Patron(guestExecutorApplied(guest, debounce.bind(null, 100))),
  );

  source.give(1);
  source.give(1);
  source.give(1);

  vi.runOnlyPendingTimers();

  expect(counter).toBe(1);
  vi.useRealTimers();
});
