import { describe, expect, test, vi } from "vitest";
import { Default } from "components/Default";
import { Message } from "base/Message";
import { Of } from "base/Of";
import { Void } from "base/Void";
import { Late } from "components/Late";
import { Empty } from "components/Empty";

describe("Default.test", () => {
  test("returns base value when base succeeds", () => {
    const baseValue = 42;
    const defaultValue = 0;
    const $base = Of(baseValue);
    const result = Default($base, defaultValue);

    const spy = vi.fn();
    result.then(spy);

    expect(spy).toHaveBeenCalledWith(baseValue);
  });

  test("returns default value when base fails", () => {
    const defaultValue = 42;
    const $base = Message<number>(() => {
      throw new Error("Base failed");
    });
    const result = Default($base, defaultValue);

    // Consume the error from base
    $base.then(Void());

    const spy = vi.fn();
    result.then(spy);

    expect(spy).toHaveBeenCalledWith(defaultValue);
  });

  test("returns default message when base fails", () => {
    const defaultValue = Of(42);
    const $base = Message<number>(() => {
      throw new Error("Base failed");
    });
    const result = Default($base, defaultValue);

    // Consume the error from base
    $base.then(Void());

    const spy = vi.fn();
    result.then(spy);

    expect(spy).toHaveBeenCalledWith(42);
  });

  test("Default and empty", () => {
    const defaultValue = Of(42);
    const $base = Late();
    const result = Default(Empty($base), defaultValue);

    // Consume the error from base
    result.then(Void());

    const spy = vi.fn();
    result.then(spy);

    expect(spy).toHaveBeenLastCalledWith(42);

    $base.use(11);
    expect(spy).toHaveBeenLastCalledWith(11);
  });
});
