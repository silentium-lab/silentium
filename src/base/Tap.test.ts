import { describe, expect, test, vi } from "vitest";
import { Tap, TapMessage, TapParent } from "base/Tap";
import { MessageType } from "types/MessageType";

describe("Tap.test.ts", () => {
  describe("Tap", () => {
    test("calls executor with value and returns tap for chaining", () => {
      const executor = vi.fn();
      const tap = Tap(executor);

      const result = tap.use("test");

      expect(executor).toHaveBeenCalledWith("test");
      expect(result).toBe(tap);
    });

    test("throws if executor is not a function", () => {
      expect(() => Tap("not a function" as any)).toThrow(
        "Tap: tap executor: is not function",
      );
    });
  });

  describe("TapMessage", () => {
    test("calls executor with value and returns the message", () => {
      const m = { pipe: vi.fn() } as MessageType<string>;
      const executor = vi.fn(() => m);
      const tap = TapMessage(executor);

      const result = tap.use("test");

      expect(executor).toHaveBeenCalledWith("test");
      expect(result).toBe(m);
    });

    test("throws if executor is not a function", () => {
      expect(() => TapMessage("not a function" as any)).toThrow(
        "TapMessage: tap executor: is not function",
      );
    });
  });

  describe("TapParent", () => {
    test("throws if no child is set", () => {
      const executor = vi.fn();
      const tap = TapParent(executor);

      expect(() => tap.use("test")).toThrow("no base tap");
    });

    test("calls executor on child with value and args", () => {
      const childExecutor = vi.fn();
      const child = Tap(childExecutor);
      let calledThis: any;
      const parentExecutor = vi.fn().mockImplementation(function (this: any) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        calledThis = this;
      });
      const tap = TapParent(parentExecutor, "arg1", "arg2").child(child);

      tap.use("test");

      expect(parentExecutor).toHaveBeenCalledWith("test", "arg1", "arg2");
      expect(calledThis).toBe(child);
    });

    test("child method creates new instance with child set", () => {
      const executor = vi.fn();
      const parent = TapParent(executor);
      const child = Tap(vi.fn());

      const newParent = parent.child(child);

      expect(newParent).not.toBe(parent);
      expect(() => parent.use("test")).toThrow("no base tap");
      expect(() => newParent.use("test")).not.toThrow();
    });

    test("throws if executor is not a function", () => {
      expect(() => TapParent("not a function" as any)).toThrow(
        "TapParent: executor: is not function",
      );
    });
  });
});
