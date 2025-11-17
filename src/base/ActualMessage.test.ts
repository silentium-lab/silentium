import { describe, expect, test, vi } from "vitest";
import { ActualMessage } from "base/ActualMessage";
import { Message } from "base/Message";
import { Tap } from "base/Tap";

describe("ActualMessage.test.ts", () => {
  test("ActualMessage wraps raw values into messages", () => {
    const rawValue = 42;
    const msg = ActualMessage(rawValue);

    const mockTap = vi.fn();
    msg.pipe(Tap(mockTap));

    expect(mockTap).toHaveBeenCalledWith(rawValue);
  });

  test("ActualMessage returns message objects unchanged", () => {
    const messageValue = "test";
    const existingMessage = Message((tap) => tap.use(messageValue));

    const msg = ActualMessage(existingMessage);

    // Ensure it's the same instance
    expect(msg).toBe(existingMessage);

    const mockTap = vi.fn();
    msg.pipe(Tap(mockTap));

    expect(mockTap).toHaveBeenCalledWith(messageValue);
  });
});
