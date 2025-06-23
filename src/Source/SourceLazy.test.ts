import { expect, test } from "vitest";
import { of } from "../Source/Of";
import { applied } from "../Source/SourceApplied";
import { lazyS } from "../Source/SourceLazy";
import { sync } from "../Source/SourceSync";
import { lazy } from "../utils/Lazy";

test("SourceLazy.test", () => {
  const [resetSrc, resetG] = of();

  const [valueSrc, valueG] = of<number>(2);
  const lazySrc = lazy(() => applied(valueSrc, (x) => x * 2));

  const twice = lazyS(lazySrc, resetSrc);
  const twiceSync = sync(twice);

  expect(twiceSync.syncValue()).toBe(4);

  valueG.give(6);

  expect(twiceSync.syncValue()).toBe(12);

  expect(twice.subSources().length).toBe(2);
  resetG.give(1);
  expect(twice.subSources().length).toBe(0);
});
