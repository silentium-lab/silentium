import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { patron } from "../Guest/Patron";
import { sourceOf } from "../Source/SourceChangeable";
import { value } from "./Source";
import { sourceAll } from "./SourceAll";
import { sourceSync } from "../Source/SourceSync";
import { destroy, patronPoolsStatistic } from "../Guest/PatronPool";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test("SourceAll._primitivesArray.test", async () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const one = 1;
  const two = sourceOf<number>();

  const all = sourceAll([one, two]);
  Promise.resolve(2).then(two.give);

  const g = vi.fn();
  await vi.advanceTimersByTime(10);

  value(all, patron(g));

  expect(g).toBeCalledWith([1, 2]);

  destroy(two, all, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
