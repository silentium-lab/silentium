import { describe, expect, test, vi } from "vitest";
import { Destructured } from "components/Destructured";
import { Of } from "base/Of";
import { All } from "components/All";

describe("Destructured.test", () => {
  test("message with destructured applied function", () => {
    const info = Of([1, 2, 3]);
    const sum = Destructured(info, (a, b, c) => a + b + c);

    const g = vi.fn();
    sum.then(g);

    expect(g).toBeCalledWith(6);
  });

  test("values with destructured applied function", () => {
    const sum = Destructured([1, 2, 3], (a, b, c) => a + b + c);

    const g = vi.fn();
    sum.then(g);

    expect(g).toBeCalledWith(6);
  });

  test("values with destructured applied function", async () => {
    const sum = Destructured([1, 2, 3], (a, b, c) => a + b + c);
    expect(await sum).toBe(6);
  });

  test("values with destructured applied function", async () => {
    const sum = Destructured(All(Of(1), Of(2), Of(3)), (a, b, c) => a + b + c);
    expect(await sum).toBe(6);
  });
});
