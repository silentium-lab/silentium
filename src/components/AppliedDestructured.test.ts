import { describe, expect, test, vi } from "vitest";
import { AppliedDestructured } from "components/AppliedDestructured";
import { Of } from "base/Of";
import { Transport } from "base/Transport";

describe("AppliedDestructured.test", () => {
  test("message with destructured applied function", () => {
    const info = Of([1, 2, 3]);
    const sum = AppliedDestructured(info, (a, b, c) => a + b + c);

    const g = vi.fn();
    sum.to(Transport(g));

    expect(g).toBeCalledWith(6);
  });
});
