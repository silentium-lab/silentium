import { describe, expect, test, vi } from "vitest";
import { ActualMessage } from "base/ActualMessage";
import { Message } from "base/Message";
import { Transport } from "base/Transport";

describe("ActualMessage.test.ts", () => {
  test("ActualMessage wraps raw values into messages", () => {
    const rawValue = 42;
    const msg = ActualMessage(rawValue);

    const mockTransport = vi.fn();
    msg.to(Transport(mockTransport));

    expect(mockTransport).toHaveBeenCalledWith(rawValue);
  });

  test("ActualMessage returns message objects unchanged", () => {
    const messageValue = "test";
    const existingMessage = Message((transport) => transport.use(messageValue));

    const msg = ActualMessage(existingMessage);

    // Ensure it's the same instance
    expect(msg).toBe(existingMessage);

    const mockTransport = vi.fn();
    msg.to(Transport(mockTransport));

    expect(mockTransport).toHaveBeenCalledWith(messageValue);
  });
});
