import { sourceDestroyable } from "../Source/SourceDestroyable";
import { expect, test } from "vitest";
import { give } from "../Guest/Guest";
import { sourceSync } from "../Source/SourceSync";
import {
  destroy,
  destroyFromSubSource,
  patronPoolsStatistic,
} from "../Guest/PatronPool";

test("SourceDestroyable.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  let isDestroyed = false;
  const src = sourceDestroyable<number>((g) => {
    give(123, g);
    return () => {
      isDestroyed = true;
    };
  });

  expect(sourceSync(src).syncValue()).toBe(123);
  expect(isDestroyed).toBe(false);

  destroy(src);

  expect(isDestroyed).toBe(true);

  destroyFromSubSource(src, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
