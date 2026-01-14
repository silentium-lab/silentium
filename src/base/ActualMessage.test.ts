import { Actual } from "base/ActualMessage";
import { Message } from "base/Message";
import { describe, expect, test, vi } from "vitest";

describe("ActualMessage.test.ts", () => {
  test("ActualMessage wraps raw values into messages", () => {
    const rawValue = 42;
    const msg = Actual(rawValue);

    const m = vi.fn();
    msg.then(m);

    expect(m).toHaveBeenCalledWith(rawValue);
  });

  test("ActualMessage returns message objects unchanged", () => {
    const messageValue = "test";
    const existingMessage = Message((r) => {
      r(messageValue);
    });

    const msg = Actual(existingMessage);

    // Ensure it's the same instance
    expect(msg).toBe(existingMessage);

    const m = vi.fn();
    msg.then(m);

    expect(m).toHaveBeenCalledWith(messageValue);
  });
});
