import { Message } from "base/Message";
import { Tap } from "base/Tap";
import { describe, expect, test, vi } from "vitest";

describe("Message.test.ts", () => {
  test("value passed from executor is the same as value of event", () => {
    const event = Message<string>(function () {
      this.use("123");
    });

    const g = vi.fn();
    event.pipe(Tap(g));

    expect(g).toHaveBeenLastCalledWith("123");
  });
});
