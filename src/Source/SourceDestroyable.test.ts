import { sourceDestroyable } from "../Source/SourceDestroyable";
import { expect, test } from "vitest";
import { give } from "../Guest/Guest";
import { sourceSync } from "../Source/SourceSync";
import { destroy } from "../Patron/PatronPool";

test("SourceDestroyable.test", () => {
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
