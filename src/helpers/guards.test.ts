import { describe, expect, test } from "vitest";
import { expectTypeOf } from "expect-type";
import {
  isFilled,
  isMessage,
  isSource,
  isDestroyable,
  isDestroyed,
} from "helpers/guards";

describe("guards", () => {
  describe("isFilled", () => {
    test("returns true for non-nullish values", () => {
      expect(isFilled(0)).toBe(true);
      expect(isFilled(false)).toBe(true);
      expect(isFilled("")).toBe(true);
      expect(isFilled({})).toBe(true);
      expect(isFilled([])).toBe(true);
      expect(isFilled(() => {})).toBe(true);
    });

    test("returns false for null and undefined", () => {
      expect(isFilled(null)).toBe(false);
      expect(isFilled(undefined)).toBe(false);
    });

    test("type guard narrows type", () => {
      const a: string | null | undefined = "test";
      if (isFilled(a)) {
        expectTypeOf(a).toBeString();
      }
    });
  });

  describe("isMessage", () => {
    test("returns true for objects with then function", () => {
      const mockMessage = { then: () => {} };
      expect(isMessage(mockMessage)).toBe(true);
    });

    test("returns false for invalid objects", () => {
      expect(isMessage(null)).toBe(false);
      expect(isMessage(undefined)).toBe(false);
      expect(isMessage({})).toBe(false);
      expect(isMessage({ then: "not function" })).toBe(false);
      expect(isMessage("string")).toBe(false);
      expect(isMessage(123)).toBe(false);
    });

    test("type guard narrows type", () => {
      const o: unknown = { then: () => {} };
      if (isMessage(o)) {
        expectTypeOf(o).not.toBeNever();
        expect(typeof o.then).toBe("function");
      }
    });
  });

  describe("isSource", () => {
    test("returns true for objects with use function", () => {
      const mockSource = { use: () => {} };
      expect(isSource(mockSource)).toBe(true);
    });

    test("returns false for invalid objects", () => {
      expect(isSource(null)).toBe(false);
      expect(isSource(undefined)).toBe(false);
      expect(isSource({})).toBe(false);
      expect(isSource({ use: "not function" })).toBe(false);
      expect(isSource("string")).toBe(false);
      expect(isSource(123)).toBe(false);
    });

    test("type guard narrows type", () => {
      const o: unknown = { use: () => {} };
      if (isSource(o)) {
        expectTypeOf(o).not.toBeNever();
        expect(typeof o.use).toBe("function");
      }
    });
  });

  describe("isDestroyable", () => {
    test("returns true for objects with destroy function", () => {
      const mockDestroyable = { destroy: () => {} };
      expect(isDestroyable(mockDestroyable)).toBe(true);
    });

    test("returns false for invalid objects", () => {
      expect(isDestroyable(null)).toBe(false);
      expect(isDestroyable(undefined)).toBe(false);
      expect(isDestroyable({})).toBe(false);
      expect(isDestroyable({ destroy: "not function" })).toBe(false);
      expect(isDestroyable("string")).toBe(false);
      expect(isDestroyable(123)).toBe(false);
    });

    test("type guard narrows type", () => {
      const o: unknown = { destroy: () => {} };
      if (isDestroyable(o)) {
        expectTypeOf(o).not.toBeNever();
        expect(typeof o.destroy).toBe("function");
      }
    });
  });

  describe("isDestroyed", () => {
    test("returns true for objects with destroyed function", () => {
      const mockDestroyed = { destroyed: () => {} };
      expect(isDestroyed(mockDestroyed)).toBe(true);
    });

    test("returns false for invalid objects", () => {
      expect(isDestroyed(null)).toBe(false);
      expect(isDestroyed(undefined)).toBe(false);
      expect(isDestroyed({})).toBe(false);
      expect(isDestroyed({ destroyed: "not function" })).toBe(false);
      expect(isDestroyed("string")).toBe(false);
      expect(isDestroyed(123)).toBe(false);
    });

    test("type guard narrows type", () => {
      const o: unknown = { destroyed: () => {} };
      if (isDestroyed(o)) {
        expectTypeOf(o).not.toBeNever();
        expect(typeof o.destroyed).toBe("function");
      }
    });
  });
});
