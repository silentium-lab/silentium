import { describe, expect, test, vi } from "vitest";
import { Of } from "base/Of";

describe("Of.test.ts", () => {
  test("Of works with different types", () => {
    const numberValue = 42;
    const msg = Of(numberValue);

    const mockTap = vi.fn();
    msg.then(mockTap);

    expect(mockTap).toHaveBeenCalledWith(numberValue);
  });

  test("Of works with objects", () => {
    const objectValue = { key: "value" };
    const msg = Of(objectValue);

    const mockTap = vi.fn();
    msg.then(mockTap);

    expect(mockTap).toHaveBeenCalledWith(objectValue);
  });
});
