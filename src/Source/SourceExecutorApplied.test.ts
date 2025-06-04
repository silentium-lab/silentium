import { expect, test } from "vitest";
import { give } from "../Guest/Guest";
import { patron } from "../Patron/Patron";
import { sourceExecutorApplied } from "../Source/SourceExecutorApplied";
import { sourceOf } from "./SourceChangeable";

test("SourceExecutorApplied.test", () => {
  const source = sourceOf<number>();
  let applierWasCalled = false;
  const sourceDebounced = sourceExecutorApplied(source, (guest) => {
    return (v) => {
      if (!applierWasCalled) {
        give(v, guest);
      }
      applierWasCalled = true;
    };
  });

  let counter = 0;
  sourceDebounced(
    patron((v) => {
      counter += v;
    }),
  );

  source.give(1);
  source.give(1);
  source.give(1);

  expect(counter).toBe(1);
});
