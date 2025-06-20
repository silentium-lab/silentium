import { patronExecutorApplied } from "./PatronExecutorApplied";
import { expect, test, vi } from "vitest";
import { sourceOf } from "../Source/SourceChangeable";
import { debounce } from "../../test-utils/debounce";

test("PatronApplied.test", () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  let counter = 0;
  const guest = (v: number) => {
    counter += v;
  };

  const source = sourceOf();
  source.value(patronExecutorApplied(guest, debounce.bind(null, 100)));

  source.give(1);
  source.give(1);
  source.give(1);

  vi.runOnlyPendingTimers();

  expect(counter).toBe(1);

  source.give(1);

  vi.runOnlyPendingTimers();

  expect(counter).toBe(2);

  vi.useRealTimers();
});
