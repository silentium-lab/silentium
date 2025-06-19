import { value } from "../Source/Source";
import { afterEach, beforeEach, expect, test, vi, vitest } from "vitest";
import { sourceOf } from "./SourceChangeable";
import { sourceRace } from "./SourceRace";
import { sourceSync } from "../Source/SourceSync";
import {
  destroyFromSubSource,
  patronPoolsStatistic,
} from "../Patron/PatronPool";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test("SourceRace.test", async () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const sBuild = (result: number, delay: number) => {
    const s = sourceOf();

    setTimeout(() => {
      s.give(result);
    }, delay);

    return s;
  };

  const s2 = sBuild(2, 100);
  const s1 = sBuild(1, 200);

  const sAny = sourceRace([s1, s2]);

  await vi.advanceTimersByTime(201);

  const g1 = vitest.fn();
  value(sAny, g1);
  expect(g1).toBeCalledWith(1);

  setTimeout(() => {
    s1.give(3);
    s2.give(4);
  }, 300);

  await vi.advanceTimersByTime(301);

  const g2 = vitest.fn();
  value(sAny, g2);
  // ignores second value
  expect(g2).toBeCalledWith(3);

  destroyFromSubSource(s1, s2, sAny, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
