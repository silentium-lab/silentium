import { Message } from "base/Message";
import { Of } from "base/Of";
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

  test("chain of messages", () => {
    const event = Message<string>(function (r) {
      r("123");
    });

    const g = vi.fn();
    const $next = event.then((v) => {
      g(v);
      return Of("321");
    });
    expect(g).toHaveBeenLastCalledWith("123");

    const g2 = vi.fn();
    $next.then(g2);
    expect(g2).toHaveBeenLastCalledWith("321");
  });
});
