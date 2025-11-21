import { Context } from "components/Context";
import { ContextOf } from "components/ContextOf";
import { describe, expect, test, vi } from "vitest";

describe("ContextOf.test", () => {
  test("creates message for specific tap and forwards RPC call", () => {
    const callback = vi.fn();
    ContextOf("testTap").then(callback);

    Context({
      transport: "testTap",
      method: "get",
    }).then(() => {});

    expect(callback).toHaveBeenCalledWith({
      transport: "testTap",
      method: "get",
      result: expect.any(Object),
      error: expect.any(Object),
    });
  });
});
