import { describe, expect, test, vi } from "vitest";
import { Void } from "base/Void";
import { Event } from "base/Event";

describe("Void.test.ts", () => {
  describe("Void", () => {
    test("triggers event executor lazily when event is called", () => {
      const eventExecutor = vi.fn();
      const event = Event(eventExecutor);

      event.event(Void());

      expect(eventExecutor).toHaveBeenCalled();
    });

    test("use method returns the transport for chaining", () => {
      const voidTransport = Void();

      const result = voidTransport.use();

      expect(result).toBe(voidTransport);
    });
  });
});
