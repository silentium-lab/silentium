import { Context } from "components/Context";
import { ContextOf } from "components/ContextOf";
import { describe, expect, test, vi } from "vitest";

describe("ContextOf.test", () => {
  test("creates message for specific transport and forwards RPC call", () => {
    const callback = vi.fn();
    ContextOf("test").then(callback);

    Context({
      transport: "test",
      method: "get",
    }).then(() => {});

    expect(callback).toHaveBeenCalledWith({
      transport: "test",
      method: "get",
      result: expect.any(Function),
      error: expect.any(Function),
    });
  });
});
