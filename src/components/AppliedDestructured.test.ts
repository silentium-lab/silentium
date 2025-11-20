import { describe, expect, test, vi } from "vitest";
import { AppliedDestructured } from "components/AppliedDestructured";
import { Of } from "base/Of";

describe("AppliedDestructured.test", () => {
  test("message with destructured applied function", () => {
    const info = Of([1, 2, 3]);
    const sum = AppliedDestructured(info, (a, b, c) => a + b + c);

    const g = vi.fn();
    sum.then(g);

    expect(g).toBeCalledWith(6);
  });

  test("values with destructured applied function", () => {
    const sum = AppliedDestructured([1, 2, 3], (a, b, c) => a + b + c);

    const g = vi.fn();
    sum.then(g);

    expect(g).toBeCalledWith(6);
  });

  test("values with destructured applied function", async () => {
    const sum = AppliedDestructured([1, 2, 3], (a, b, c) => a + b + c);
    const r = await sum;

    expect(r).toBe(6);
  });
});
