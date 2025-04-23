import { expect, test, vi } from "vitest";
import { debounce } from "../../test-utils/debounce";
import { patron } from "../Patron/Patron";
import { sourceExecutorApplied } from "../Source/SourceExecutorApplied";
import { sourceChangeable } from "./SourceChangeable";

test("SourceExecutorApplied.test", () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });

  const source = sourceChangeable<number>();
  const sourceDebounced = sourceExecutorApplied(
    source,
    debounce.bind(null, 100),
  );

  let counter = 0;
  sourceDebounced(
    patron((v) => {
      counter += v;
    }),
  );

  source.give(1);
  source.give(1);
  source.give(1);

  vi.runOnlyPendingTimers();

  expect(counter).toBe(1);
});
