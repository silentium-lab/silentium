import { describe, expect, test } from "vitest";
import { ensureFunction, ensureMessage } from "./ensures";

describe("ensures", () => {
  describe("ensureFunction", () => {
    test("does not throw for function values", () => {
      const fn = () => {};
      expect(() => ensureFunction(fn, "test")).not.toThrow();
    });

    test("throws error for non-function values", () => {
      expect(() => ensureFunction("string", "test")).toThrowError(
        "test: is not function",
      );
      expect(() => ensureFunction(123, "test")).toThrowError(
        "test: is not function",
      );
      expect(() => ensureFunction({}, "test")).toThrowError(
        "test: is not function",
      );
      expect(() => ensureFunction(null, "test")).toThrowError(
        "test: is not function",
      );
      expect(() => ensureFunction(undefined, "test")).toThrowError(
        "test: is not function",
      );
    });
  });

  describe("ensureMessage", () => {
    test("does not throw for valid message objects", () => {
      const mockMessage = { then: () => {} };
      expect(() => ensureMessage(mockMessage, "test")).not.toThrow();
    });

    test("throws error for invalid message values", () => {
      expect(() => ensureMessage(null, "test")).toThrowError(
        "test: is not message",
      );
      expect(() => ensureMessage(undefined, "test")).toThrowError(
        "test: is not message",
      );
      expect(() => ensureMessage({}, "test")).toThrowError(
        "test: is not message",
      );
      expect(() =>
        ensureMessage({ then: "not function" }, "test"),
      ).toThrowError("test: is not message");
      expect(() => ensureMessage("string", "test")).toThrowError(
        "test: is not message",
      );
      expect(() => ensureMessage(123, "test")).toThrowError(
        "test: is not message",
      );
    });
  });
});
