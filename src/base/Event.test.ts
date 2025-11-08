import { describe, expect, test, vi } from "vitest";
import { Event } from "base/Event";
import { TransportType } from "types/TransportType";
import { Transport } from "base/Transport";

describe("Event.test.ts", () => {
  test("value passed from eventExecutor is the same as value of event", () => {
    const event = Event((transport: TransportType<string>) => {
      transport.use("123");
    });

    const g = vi.fn();
    event.event(Transport(g));

    expect(g).toHaveBeenLastCalledWith("123");
  });
});
