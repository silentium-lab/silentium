import { O } from "./Owner";
import { of } from "../Information/Of";
import { expect, test, vi } from "vitest";
import { debounce } from "../../testing/debounce";
import { ownerExecutorApplied } from "./OwnerExecutorApplied";

test("ownerExecutorApplied.test", () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  let counter = 0;
  const owner = () => {
    counter += 1;
  };

  const [info, sG] = of<number>();
  info.value(ownerExecutorApplied(O(owner), debounce.bind(null, 100) as any));

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
