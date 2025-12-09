import { Of } from "base/Of";
import { DevTools } from "helpers/DevTools";
import { describe, expect, test } from "vitest";

describe("DevTools.test", () => {
  DevTools();
  test("raw value of silentium message", () => {
    expect(silentiumValue(Of(123))).toBe(123);
  });
});
