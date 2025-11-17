import { TapOptionalImpl } from "base/TapOptional";
import { MessageType } from "types/MessageType";
import { TapType } from "types/TapType";
import { describe, expect, test, vi } from "vitest";

describe("TapOptional.test.ts", () => {
  describe("wait", () => {
    test("does nothing and returns this when no base", () => {
      const instance = new TapOptionalImpl();
      const m = { pipe: vi.fn() } as MessageType;

      const result = instance.wait(m);

      expect(m.pipe).not.toHaveBeenCalled();
      expect(result).toBe(instance);
    });

    test("calls message.to with base and returns this when base exists", () => {
      const mockTap = { use: vi.fn() } as TapType;
      const instance = new TapOptionalImpl(mockTap);
      const m = { pipe: vi.fn().mockReturnThis() } as MessageType;

      const result = instance.wait(m);

      expect(m.pipe).toHaveBeenCalledWith(mockTap);
      expect(result).toBe(instance);
    });
  });
});
