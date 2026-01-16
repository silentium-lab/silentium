import { Of } from "base/Of";
import { Fold } from "components/Fold";
import { Late } from "components/Late";
import { describe, expect, test } from "vitest";

describe("Fold.test", () => {
  test("basic fold sum", async () => {
    const $sum = Fold(
      Of([1, 2, 3, 4]),
      (acc: number, curr: number) => acc + curr,
      Of(0),
    );
    expect(await $sum).toBe(10);
  });

  test("fold with initial value", async () => {
    const $product = Fold(
      Of([2, 3, 4]),
      (acc: number, curr: number) => acc * curr,
      Of(1),
    );
    expect(await $product).toBe(24);
  });

  test("fold empty array", async () => {
    const $sum = Fold(
      Of([]),
      (acc: number, curr: number) => acc + curr,
      Of(42),
    );
    expect(await $sum).toBe(42);
  });

  test("reactive fold", async () => {
    const $data = Late([1, 2, 3]);
    const $initial = Late(0);
    const $sum = Fold(
      $data,
      (acc: number, curr: number) => acc + curr,
      $initial,
    );
    expect(await $sum).toBe(6);

    $data.use([4, 5, 6]);
    expect(await $sum).toBe(15);

    $initial.use(10);
    expect(await $sum).toBe(25);
  });

  test("fold with string concatenation", async () => {
    const $result = Fold(
      Of(["a", "b", "c"]),
      (acc: string, curr: string) => acc + curr,
      Of(""),
    );
    expect(await $result).toBe("abc");
  });
});
