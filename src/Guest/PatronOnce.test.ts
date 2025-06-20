import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { sourceOf } from "../Source/SourceChangeable";
import { wait } from "../../test-utils/wait";
import { patronOnce } from "./PatronOnce";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test("PatronOnce.test", async () => {
  const source = sourceOf<number>(12);
  let calls = 0;
  const patron = patronOnce(() => {
    calls += 1;
  });
  source.value(patron);

  await wait(10);
  source.give(22);
  await wait(10);
  source.give(32);
  await wait(10);
  source.give(42);
  await wait(10);

  expect(calls).toBe(1);
});
