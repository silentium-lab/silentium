import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { patron } from "../Patron/Patron";
import { sourceOf } from "../Source/SourceChangeable";
import { value } from "./Source";
import { sourceAll } from "./SourceAll";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test("SourceAll._primitivesArray.test", async () => {
  const one = 1;
  const two = sourceOf<number>();

  const all = sourceAll([one, two]);
  Promise.resolve(2).then(two.give);

  const g = vi.fn();
  await vi.advanceTimersByTime(10);

  value(all, patron(g));

  expect(g).toBeCalledWith([1, 2]);
});
