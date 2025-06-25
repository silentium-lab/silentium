import { expect, test } from "vitest";
import { lazy } from "./Lazy";

test("Lazy.test", () => {
  const privateNum = lazy((val) => {
    return {
      num: val,
    };
  });

  expect(JSON.stringify(privateNum.get(11))).toBe('{"num":11}');
});
