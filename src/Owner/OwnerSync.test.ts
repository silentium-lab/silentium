import { ownerSync } from "./OwnerSync";
import { I } from "../Information";
import { expect, test } from "vitest";

test("OwnerSync.test", () => {
  const i = I("hello");
  const o = ownerSync(i);
  expect(o.syncValue()).toBe("hello");
  expect(o.filled()).toBe(true);
});
