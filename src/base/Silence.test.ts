import { Silence, SilenceUse } from "base/Silence";
import { describe, expect, test, vi } from "vitest";

describe("Silence.test", () => {
  test("should call resolve with first filled value", () => {
    const resolve = vi.fn();
    const silence = Silence(resolve);

    silence(1);
    expect(resolve).toHaveBeenCalledWith(1);
  });

  test("should not call resolve with null value", () => {
    const resolve = vi.fn();
    const silence = Silence(resolve);

    silence(null);
    expect(resolve).not.toHaveBeenCalled();
  });

  test("should not call resolve with undefined value", () => {
    const resolve = vi.fn();
    const silence = Silence(resolve);

    silence(undefined);
    expect(resolve).not.toHaveBeenCalled();
  });

  test("should not call resolve with duplicate values", () => {
    const resolve = vi.fn();
    const silence = Silence(resolve);

    silence(1);

    expect(resolve).toHaveBeenCalledTimes(1);
    expect(resolve).toHaveBeenCalledWith(1);
  });

  test("should call resolve with different values", () => {
    const resolve = vi.fn();
    const silence = Silence(resolve);

    silence(1);
    silence(2);
    silence(3);
    expect(resolve).toHaveBeenCalledTimes(3);
    expect(resolve).toHaveBeenCalledWith(1);
    expect(resolve).toHaveBeenCalledWith(2);
    expect(resolve).toHaveBeenCalledWith(3);
  });

  test("should handle mixed null/undefined and valid values", () => {
    const resolve = vi.fn();
    const silence = Silence(resolve);

    silence(null);
    silence(undefined);
    silence(1);
    silence(null);
    silence(2);
    silence(undefined);
    silence(3);

    expect(resolve).toHaveBeenCalledTimes(3);
    expect(resolve).toHaveBeenCalledWith(1);
    expect(resolve).toHaveBeenCalledWith(2);
    expect(resolve).toHaveBeenCalledWith(3);
  });

  test("should handle zero values correctly", () => {
    const resolve = vi.fn();
    const silence = Silence(resolve);

    silence(0);
    silence(1);

    expect(resolve).toHaveBeenCalledTimes(2);
    expect(resolve).toHaveBeenCalledWith(0);
    expect(resolve).toHaveBeenCalledWith(1);
  });

  test("should handle empty string values correctly", () => {
    const resolve = vi.fn();
    const silence = Silence(resolve);

    silence("");
    silence("hello");

    expect(resolve).toHaveBeenCalledTimes(2);
    expect(resolve).toHaveBeenCalledWith("");
    expect(resolve).toHaveBeenCalledWith("hello");
  });

  test("identity key silence", () => {
    const a = {
      name: "one",
      identityKey() {
        return "alice";
      },
    };
    const b = {
      name: "two",
      identityKey() {
        return "alice";
      },
    };
    const resolve = vi.fn();
    const silence = Silence(resolve);

    silence(a);
    silence(b);

    expect(resolve).toHaveBeenCalledTimes(1);
  });

  test("identity key silence use", () => {
    const a = {
      name: "one",
      identityKey() {
        return "alice";
      },
    };
    const b = {
      name: "two",
      identityKey() {
        return "alice";
      },
    };
    const resolve = vi.fn();
    const silence = SilenceUse();

    silence.use(a, resolve);
    silence.use(b, resolve);

    expect(resolve).toHaveBeenCalledTimes(1);
  });
});
