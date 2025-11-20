import { describe, expect, test, vi } from "vitest";
import { Void } from "base/Void";
import { Message } from "base/Message";

describe("Void.test.ts", () => {
  describe("Void", () => {
    test("triggers message executor lazily when message is called", () => {
      const e = vi.fn();
      const m = Message(e);

      m.then(Void());

      expect(e).toHaveBeenCalled();
    });
  });
});
