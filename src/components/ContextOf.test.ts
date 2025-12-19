import { Void } from "base/Void";
import { Context } from "components/Context";
import { ContextOf } from "components/ContextOf";
import { describe, expect, test, vi } from "vitest";

describe("ContextOf.test", () => {
  test("creates message for specific transport and forwards Context call", () => {
    const callback = vi.fn();
    ContextOf("test").then(callback);
    Context("test").then(Void());

    expect(callback).toHaveBeenCalledWith({
      transport: "test",
      params: {},
      result: expect.any(Function),
      error: expect.any(Function),
    });
  });
});
