import { describe, expect, test, vi } from "vitest";
import { Of } from "base/Of";
import { Transport } from "base/Transport";

describe("Of.test.ts", () => {
  test("Of works with different types", () => {
    const numberValue = 42;
    const msg = Of(numberValue);

    const mockTransport = vi.fn();
    msg.to(Transport(mockTransport));

    expect(mockTransport).toHaveBeenCalledWith(numberValue);
  });

  test("Of works with objects", () => {
    const objectValue = { key: "value" };
    const msg = Of(objectValue);

    const mockTransport = vi.fn();
    msg.to(Transport(mockTransport));

    expect(mockTransport).toHaveBeenCalledWith(objectValue);
  });
});
