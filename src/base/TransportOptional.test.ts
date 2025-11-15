import { TransportOptionalImpl } from "base/TransportOptional";
import { MessageType } from "types/MessageType";
import { TransportType } from "types/TransportType";
import { describe, expect, test, vi } from "vitest";

describe("TransportOptional.test.ts", () => {
  describe("wait", () => {
    test("does nothing and returns this when no base", () => {
      const instance = new TransportOptionalImpl();
      const m = { to: vi.fn() } as MessageType;

      const result = instance.wait(m);

      expect(m.to).not.toHaveBeenCalled();
      expect(result).toBe(instance);
    });

    test("calls message.to with base and returns this when base exists", () => {
      const mockTransport = { use: vi.fn() } as TransportType;
      const instance = new TransportOptionalImpl(mockTransport);
      const m = { to: vi.fn().mockReturnThis() } as MessageType;

      const result = instance.wait(m);

      expect(m.to).toHaveBeenCalledWith(mockTransport);
      expect(result).toBe(instance);
    });
  });
});
