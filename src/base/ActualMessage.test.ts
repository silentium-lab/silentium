import { ActualMessage } from "base/ActualMessage";
import { Message } from "base/Message";
import { describe, expect, test, vi } from "vitest";

describe("ActualMessage.test.ts", () => {
  test("ActualMessage wraps raw values into messages", () => {
    const rawValue = 42;
    const msg = ActualMessage(rawValue);

    const mockTap = vi.fn();
    msg.then(mockTap);

    expect(mockTap).toHaveBeenCalledWith(rawValue);
  });

  test("ActualMessage returns message objects unchanged", () => {
    const messageValue = "test";
    const existingMessage = Message((tap) => tap(messageValue));

    const msg = ActualMessage(existingMessage);

    // Ensure it's the same instance
    expect(msg).toBe(existingMessage);

    const mockTap = vi.fn();
    msg.then(mockTap);

    expect(mockTap).toHaveBeenCalledWith(messageValue);
  });
});
