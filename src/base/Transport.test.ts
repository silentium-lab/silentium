import { describe, expect, test, vi } from "vitest";
import { Transport, TransportEvent, TransportParent } from "base/Transport";
import { EventType } from "types/EventType";

describe("Transport.test.ts", () => {
  describe("Transport", () => {
    test("calls executor with value and returns transport for chaining", () => {
      const executor = vi.fn();
      const transport = Transport(executor);

      const result = transport.use("test");

      expect(executor).toHaveBeenCalledWith("test");
      expect(result).toBe(transport);
    });

    test("throws if executor is not a function", () => {
      expect(() => Transport("not a function" as any)).toThrow(
        "Transport: transport executor: is not function",
      );
    });
  });

  describe("TransportEvent", () => {
    test("calls executor with value and returns the event", () => {
      const mockEvent = { event: vi.fn() } as EventType<string>;
      const executor = vi.fn(() => mockEvent);
      const transport = TransportEvent(executor);

      const result = transport.use("test");

      expect(executor).toHaveBeenCalledWith("test");
      expect(result).toBe(mockEvent);
    });

    test("throws if executor is not a function", () => {
      expect(() => TransportEvent("not a function" as any)).toThrow(
        "TransportEvent: transport executor: is not function",
      );
    });
  });

  describe("TransportParent", () => {
    test("throws if no child is set", () => {
      const executor = vi.fn();
      const transport = TransportParent(executor);

      expect(() => transport.use("test")).toThrow("no base transport");
    });

    test("calls executor on child with value and args", () => {
      const childExecutor = vi.fn();
      const child = Transport(childExecutor);
      let calledThis: any;
      const parentExecutor = vi.fn().mockImplementation(function (this: any) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        calledThis = this;
      });
      const transport = TransportParent(parentExecutor, "arg1", "arg2").child(
        child,
      );

      transport.use("test");

      expect(parentExecutor).toHaveBeenCalledWith("test", "arg1", "arg2");
      expect(calledThis).toBe(child);
    });

    test("child method creates new instance with child set", () => {
      const executor = vi.fn();
      const parent = TransportParent(executor);
      const child = Transport(vi.fn());

      const newParent = parent.child(child);

      expect(newParent).not.toBe(parent);
      expect(() => parent.use("test")).toThrow("no base transport");
      expect(() => newParent.use("test")).not.toThrow();
    });

    test("throws if executor is not a function", () => {
      expect(() => TransportParent("not a function" as any)).toThrow(
        "TransportParent: executor: is not function",
      );
    });
  });
});
