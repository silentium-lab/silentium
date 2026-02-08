import { describe, expect, test } from "vitest";
import { Promisify } from "components/Promisify";
import { Message } from "base/Message";
import { Of } from "base/Of";

describe("Promisify.test", () => {
  test("resolves promise when message succeeds", async () => {
    const value = 42;
    const $message = Of(value);
    const promise = Promisify($message);

    const result = await promise;
    expect(result).toBe(value);
  });

  test("rejects promise when message fails", async () => {
    const error = new Error("Message failed");
    const $message = Message<number>(() => {
      throw error;
    });
    const promise = Promisify($message);

    await expect(promise).rejects.toThrow(error);
  });

  test("resolves promise with correct type", async () => {
    const value = "test";
    const $message = Of(value);
    const promise = Promisify($message);

    const result = await promise;
    expect(result).toBe(value);
    expect(typeof result).toBe("string");
  });

  test("handles multiple resolutions correctly", async () => {
    const value = 42;
    const $message = Of(value);
    const promise = Promisify($message);

    const result1 = await promise;
    const result2 = await promise;

    expect(result1).toBe(value);
    expect(result2).toBe(value);
  });
});
