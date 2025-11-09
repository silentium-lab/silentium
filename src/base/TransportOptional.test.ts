import { TransportOptionalImpl } from "base/TransportOptional";
import { EventType } from "types/EventType";
import { TransportType } from "types/TransportType";
import { describe, expect, test, vi } from "vitest";

describe("TransportOptional.test.ts", () => {
  describe("wait", () => {
    test("does nothing and returns this when no base", () => {
      const instance = new TransportOptionalImpl();
      const mockEvent = { event: vi.fn() } as EventType;

      const result = instance.wait(mockEvent);

      expect(mockEvent.event).not.toHaveBeenCalled();
      expect(result).toBe(instance);
    });

    test("calls event.event with base and returns this when base exists", () => {
      const mockTransport = { use: vi.fn() } as TransportType;
      const instance = new TransportOptionalImpl(mockTransport);
      const mockEvent = { event: vi.fn().mockReturnThis() } as EventType;

      const result = instance.wait(mockEvent);

      expect(mockEvent.event).toHaveBeenCalledWith(mockTransport);
      expect(result).toBe(instance);
    });
  });
});
