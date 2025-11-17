import { describe, expect, test, vi } from "vitest";
import { Void } from "base/Void";
import { Message } from "base/Message";

describe("Void.test.ts", () => {
  describe("Void", () => {
    test("triggers message executor lazily when message is called", () => {
      const e = vi.fn();
      const m = Message(e);

      m.pipe(Void());

      expect(e).toHaveBeenCalled();
    });

    test("use method returns the tap for chaining", () => {
      const voidTap = Void();

      const result = voidTap.use();

      expect(result).toBe(voidTap);
    });
  });
});
