import { New } from "base/New";
import { describe, expect, test, vi } from "vitest";

function createTestObject() {
  return { value: Math.random() };
}

describe("New.test.ts", () => {
  describe("New", () => {
    test("returns an msg that creates new instances", () => {
      const msg = New(createTestObject);
      const tapExecutor = vi.fn();

      msg.then(tapExecutor);

      expect(tapExecutor).toHaveBeenCalledTimes(1);
      const instance = tapExecutor.mock.calls[0][0];
      expect(instance).toHaveProperty("value");
      expect(typeof instance.value).toBe("number");
    });

    test("creates new instance on each call", () => {
      const msg = New(createTestObject);
      const tapExecutor1 = vi.fn();
      const tapExecutor2 = vi.fn();

      msg.then(tapExecutor1);
      msg.then(tapExecutor2);

      expect(tapExecutor1).toHaveBeenCalledTimes(1);
      expect(tapExecutor2).toHaveBeenCalledTimes(1);

      const instance1 = tapExecutor1.mock.calls[0][0];
      const instance2 = tapExecutor2.mock.calls[0][0];

      expect(instance1).toHaveProperty("value");
      expect(instance2).toHaveProperty("value");
      expect(instance1).not.toBe(instance2);
      expect(instance1.value).not.toBe(instance2.value);
    });
  });
});
