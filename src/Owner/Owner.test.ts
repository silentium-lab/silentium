import { expect, test } from "vitest";
import { O } from "./Owner";

test("owner.test", () => {
  let debugValue: unknown = "";
  let value: unknown = "";
  const o = O((v) => {
    value = v;
  }).debug((msg, val) => {
    debugValue = `msg: ${msg}, val: ${val}`;
  });

  o.give(1);

  expect(value).toBe(1);
  expect(debugValue).toBe("msg: value, val: 1");

  o.give(42);

  expect(value).toBe(42);
  expect(debugValue).toBe("msg: value, val: 42");

  o.error("Boom!");

  expect(value).toBe(42);
  expect(debugValue).toBe("msg: error, val: Boom!");
});
