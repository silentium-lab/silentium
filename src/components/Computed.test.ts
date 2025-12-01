import { Of } from "base/Of";
import { Computed } from "components/Computed";
import { LateShared } from "components/LateShared";
import { describe, expect, test } from "vitest";

describe("Computed.test", () => {
  const sum = (a: number, b: number) => a + b;

  test("regular usage", async () => {
    const $sum = Computed(sum, Of(4), 5);
    expect(await $sum).toBe(9);
  });

  test("reactive usage", async () => {
    const $a = LateShared(1);
    const $b = LateShared(2);
    const $sum = Computed(sum, $a, $b);
    expect(await $sum).toBe(3);

    $a.use(8);
    $b.use(7);
    expect(await $sum).toBe(15);
  });
});
