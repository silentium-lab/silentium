import { expect, test } from "vitest";
import { I, poolStateless } from "../Information";
import { ownerSync } from "./OwnerSync";

test("OwnerSync._of.test", () => {
  const [p] = poolStateless(I(1));
  const o = ownerSync(p);
  expect(o.syncValue()).toBe(1);
  expect(o.filled()).toBe(true);
});
