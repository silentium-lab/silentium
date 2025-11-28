import { describe, expect, test } from "vitest";
import { Message } from "base/Message";
import { Freeze } from "components/Freeze";
import { Late } from "components/Late";
import { Of } from "base/Of";
import { Shared } from "components/Shared";
import { Void } from "base/Void";

describe("Freeze.test", () => {
  test("basic freeze with immediate value", async () => {
    const $base = Of(42);
    const $frozen = Freeze($base);

    const result = await $frozen;
    expect(result).toBe(42);
  });

  test("freeze caches the first value", async () => {
    const $late = Shared(Late<number>());
    const $frozen = Freeze($late);

    // Set initial value
    $late.use(10);

    expect(await $frozen).toBe(10);

    // Change late value
    $late.use(20);

    // But freeze still holds first value
    expect(await new Promise<number>((resolve) => $frozen.then(resolve))).toBe(
      10,
    );
  });

  test("multiple then calls return cached value", () => {
    const $base = Of(100);
    const $frozen = Freeze($base);

    const results: number[] = [];
    $frozen.then((v) => results.push(v));
    $frozen.then((v) => results.push(v));

    expect(results).toEqual([100, 100]);
  });

  test("freeze with no base value yet", () => {
    const $late = Late<number>();
    const $frozen = Freeze($late);

    let resolved = false;
    $frozen.then((v) => {
      expect(v).toBe(5);
      resolved = true;
    });

    $late.use(5);
    expect(resolved).toBe(true);
  });

  test("invalidation resets cache", async () => {
    const $late = Shared(Late<number>());
    const $invalidate = Late<number>();
    const $frozen = Freeze($late, $invalidate);

    // Set first value
    $late.use(1);
    expect(await $frozen).toBe(1);

    // Invalidate
    $invalidate.use(99);

    // Now set new value - should be cached again
    $late.use(2);
    expect(await $frozen).toBe(2);
  });

  test("invalidation allows recaching new value", () => {
    const $late = Shared(Late<number>());
    const $invalidate = Late<number>();
    const $frozen = Freeze($late, $invalidate);

    // First value
    $late.use(1);
    $frozen.then((v) => expect(v).toBe(1));

    // Invalidate and set new value
    $invalidate.use(88);
    $late.use(2);
    $frozen.then((v) => expect(v).toBe(2));
  });

  test("without invalidation parameter", () => {
    const $late = Late<number>();
    const $frozen = Freeze($late);

    $late.use(1);
    $frozen.then((v) => expect(v).toBe(1));
    $late.use(2);
    $frozen.then((v) => expect(v).toBe(1)); // Still cached first value
  });

  test("error from base is propagated", () => {
    const $base = Message<number>((resolve, reject) => {
      reject("base error");
    });
    const $frozen = Freeze($base);

    let errorCaught: string | null = null;
    $frozen.then(Void());
    $frozen.catch((e) => {
      errorCaught = e as string;
    });

    expect(errorCaught).toBe("base error");
  });

  test("destruction", () => {
    const $late = Late<number>();
    const $frozen = Freeze($late);

    $frozen.destroy(); // Should not throw
  });
});
