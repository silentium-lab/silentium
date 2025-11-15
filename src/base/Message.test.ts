import { describe, expect, test, vi } from "vitest";
import { Message } from "base/Message";
import { TransportType } from "types/TransportType";
import { Transport } from "base/Transport";

describe("Message.test.ts", () => {
  test("value passed from executor is the same as value of event", () => {
    const event = Message((transport: TransportType<string>) => {
      transport.use("123");
    });

    const g = vi.fn();
    event.to(Transport(g));

    expect(g).toHaveBeenLastCalledWith("123");
  });
});
