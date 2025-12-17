import { Of } from "base/Of";
import { DevTools } from "helpers/DevTools";
import { describe, expect, test, vi } from "vitest";

describe("DevTools.test", () => {
  DevTools();
  test("raw value of silentium message", () => {
    expect(silentiumDebug.value(Of(123))).toBe(123);
  });

  test("destroyable", async () => {
    const destroyed = vi.fn();
    const $m = silentiumDebug.destroyable(destroyed);
    expect(await $m).toContain("Wait destroy");

    $m.destroy();
    expect(destroyed).toBeCalledTimes(1);
  });

  test("destroyable without reading value", async () => {
    const destroyed = vi.fn();
    const $m = silentiumDebug.destroyable(destroyed);
    $m.destroy();
    expect(destroyed).toBeCalledTimes(1);
  });
});
