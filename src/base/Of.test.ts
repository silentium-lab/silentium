import { describe, expect, test, vi } from "vitest";
import { Of } from "base/Of";

describe("Of.test.ts", () => {
  test("Of works with different types", () => {
    const numberValue = 42;
    const msg = Of(numberValue);

    const m = vi.fn();
    msg.then(m);

    expect(m).toHaveBeenCalledWith(numberValue);
  });

  test("Of works with objects", () => {
    const objectValue = { key: "value" };
    const msg = Of(objectValue);

    const m = vi.fn();
    msg.then(m);

    expect(m).toHaveBeenCalledWith(objectValue);
  });
});
