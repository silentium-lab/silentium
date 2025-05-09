import { expect, test } from "vitest";
import { personal } from "./Personal";

test("Personal.test", () => {
  const privateNum = personal((val) => {
    return {
      num: val,
    };
  });

  expect(JSON.stringify(privateNum.get(11))).toBe('{"num":11}');
});
