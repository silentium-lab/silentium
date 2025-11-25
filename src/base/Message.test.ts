import { Message } from "base/Message";
import { describe, expect, test, vi } from "vitest";

describe("Message.test.ts", () => {
  test("value passed from executor is the same as value of event", () => {
    const event = Message<string>(function (r) {
      r("123");
    });

    const g = vi.fn();
    event.then(g);

    expect(g).toHaveBeenLastCalledWith("123");
  });
});
