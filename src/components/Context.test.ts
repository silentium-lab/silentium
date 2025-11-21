import { Context } from "components/Context";
import { ContextType } from "types/ContextType";
import { describe, expect, test, vi } from "vitest";

describe("Context.test", () => {
  test("result() calls tap and returns result message", () => {
    Context.transport.default = (ctx: ContextType) => {
      ctx.result?.("hello");
    };

    const rpcImpl = Context({
      transport: "testMethod",
      params: { key: "value" },
    });

    const g = vi.fn();
    rpcImpl.then(g);
    const err = vi.fn();
    rpcImpl.catch(err);

    expect(g).toHaveBeenCalledWith("hello");
    expect(err).not.toHaveBeenCalled();
  });

  test("error from context", () => {
    Context.transport.default = (ctx: ContextType) => {
      ctx.error?.("hello");
    };

    const rpcImpl = Context({
      transport: "testMethod",
      params: { key: "value" },
    });

    const g = vi.fn();
    rpcImpl.then(g);
    const err = vi.fn();
    rpcImpl.catch(err);

    expect(g).not.toHaveBeenCalled();
    expect(err).toHaveBeenCalledWith("hello");
  });
});
