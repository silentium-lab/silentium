import { Patron } from "../Patron/Patron";
import { expect, test, vi } from "vitest";
import { sourceChangeable } from "../Source/SourceChangeable";
import { GuestExecutorApplied } from "../Guest/GuestExecutorApplied";
import { debounce } from "../../test-utils/debounce";

test("GuestExecutorApplied.test", () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  let counter = 0;
  const guest = (v: number) => {
    counter += v;
  };

  const source = sourceChangeable();
  source.value(
    new Patron(new GuestExecutorApplied(guest, debounce.bind(null, 100))),
  );

  source.give(1);
  source.give(1);
  source.give(1);

  vi.runOnlyPendingTimers();

  expect(counter).toBe(1);
  vi.useRealTimers();
});
