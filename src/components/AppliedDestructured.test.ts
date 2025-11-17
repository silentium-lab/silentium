import { describe, expect, test, vi } from "vitest";
import { AppliedDestructured } from "components/AppliedDestructured";
import { Of } from "base/Of";
import { Tap } from "base/Tap";

describe("AppliedDestructured.test", () => {
  test("message with destructured applied function", () => {
    const info = Of([1, 2, 3]);
    const sum = AppliedDestructured(info, (a, b, c) => a + b + c);

    const g = vi.fn();
    sum.pipe(Tap(g));

    expect(g).toBeCalledWith(6);
  });

  test("values with destructured applied function", () => {
    const sum = AppliedDestructured([1, 2, 3], (a, b, c) => a + b + c);

    const g = vi.fn();
    sum.pipe(Tap(g));

    expect(g).toBeCalledWith(6);
  });
});
