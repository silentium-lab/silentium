import { G } from "../Guest/Guest";
import { of } from "../Source/Of";
import { expect, test, vi } from "vitest";
import { debounce } from "../../test-utils/debounce";
import { executorAppliedG } from "../Guest/GuestExecutorApplied";

test("GuestExecutorApplied.test", () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  let counter = 0;
  const guest = () => {
    counter += 1;
  };

  const [source, sG] = of<number>();
  source.value(executorAppliedG(G(guest), debounce.bind(null, 100) as any));

  sG.give(2);
  sG.give(3);
  sG.give(4);
  sG.give(5);
  sG.give(6);
  sG.give(7);

  vi.runOnlyPendingTimers();

  expect(counter).toBe(1);
  vi.useRealTimers();
});
