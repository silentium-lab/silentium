import { expect, test } from "vitest";
import { of } from "./Of";
import { applied } from "./Applied";
import { lazyS } from "./Lazy";
import { lazy } from "../utils/Lazy";
import { ownerSync } from "../Owner/OwnerSync";

test("Lazy.test", () => {
  const [resetI, resetG] = of();

  const [valueI, valueG] = of<number>(2);
  const lazyI = lazy(() => applied(valueI, (x) => x * 2));

  const twice = lazyS(lazyI, resetI);
  const twiceSync = ownerSync(twice);

  expect(twiceSync.syncValue()).toBe(4);

  valueG.give(6);

  expect(twiceSync.syncValue()).toBe(12);

  expect(twice.subInfos().length).toBe(2);
  resetG.give(1);
  expect(twice.subInfos().length).toBe(0);
});
