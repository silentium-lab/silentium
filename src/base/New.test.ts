import { describe, expect, test, vi } from "vitest";
import { New } from "base/New";
import { Transport } from "base/Transport";

function createTestObject() {
  return { value: Math.random() };
}

describe("New.test.ts", () => {
  describe("New", () => {
    test("returns an msg that creates new instances", () => {
      const msg = New(createTestObject);
      const transportExecutor = vi.fn();
      const transport = Transport(transportExecutor);

      msg.to(transport);

      expect(transportExecutor).toHaveBeenCalledTimes(1);
      const instance = transportExecutor.mock.calls[0][0];
      expect(instance).toHaveProperty("value");
      expect(typeof instance.value).toBe("number");
    });

    test("creates new instance on each call", () => {
      const msg = New(createTestObject);
      const transportExecutor1 = vi.fn();
      const transportExecutor2 = vi.fn();
      const transport1 = Transport(transportExecutor1);
      const transport2 = Transport(transportExecutor2);

      msg.to(transport1);
      msg.to(transport2);

      expect(transportExecutor1).toHaveBeenCalledTimes(1);
      expect(transportExecutor2).toHaveBeenCalledTimes(1);

      const instance1 = transportExecutor1.mock.calls[0][0];
      const instance2 = transportExecutor2.mock.calls[0][0];

      expect(instance1).toHaveProperty("value");
      expect(instance2).toHaveProperty("value");
      expect(instance1).not.toBe(instance2);
      expect(instance1.value).not.toBe(instance2.value);
    });
  });
});
