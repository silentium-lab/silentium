import { sourceDestroyable } from "../Source/SourceDestroyable";
import { expect, test } from "vitest";
import { give } from "../Guest/Guest";
import { sourceSync } from "../Source/SourceSync";
import { destroy, patronPoolsStatistic } from "../Patron/PatronPool";

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
});
