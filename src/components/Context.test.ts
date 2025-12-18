import { Context } from "components/Context";
import { ContextType } from "types/ContextType";
import { describe, expect, test, vi } from "vitest";

describe("Context.test", () => {
  test("context behavior", () => {
    const transport = Symbol("test");
    Context.transport.set(transport, (ctx: ContextType) => {
      ctx.result?.("hello");
    });

    const $v = Context(transport, {
      params: { key: "value" },
    });

    const g = vi.fn();
    $v.then(g);
    const err = vi.fn();
    $v.catch(err);

    expect(g).toHaveBeenCalledWith("hello");
    expect(err).not.toHaveBeenCalled();
    Context.transport.delete(transport);
  });

  test("error from context", () => {
    const transport = Symbol();
    Context.transport.set(transport, () => {
      throw "hello";
    });

    const $v = Context(transport, {
      params: { key: "value" },
    });

    const g = vi.fn();
    $v.then(g);
    const err = vi.fn();
    $v.catch(err);

    expect(g).not.toHaveBeenCalled();
    expect(err).toHaveBeenCalledWith("hello");
    Context.transport.delete(transport);
  });
});
