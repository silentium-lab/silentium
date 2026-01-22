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

  test("destroying a then subscription does not affect other subscriptions", async () => {
    const mock1 = vi.fn();
    const mock2 = vi.fn();
    const event = Message<string>((r) => {
      setTimeout(() => r("test value"), 10);
    });

    const sub1 = event.then(mock1);
    event.then(mock2);

    // Destroy sub1
    sub1.destroy();

    // Wait for resolution
    await new Promise((resolve) => setTimeout(resolve, 20));

    // sub1 should not be called, sub2 should be
    expect(mock1).not.toHaveBeenCalled();
    expect(mock2).toHaveBeenCalledWith("test value");
  });

  test("destroying the main message destroys all subscriptions", async () => {
    const mock1 = vi.fn();
    const mock2 = vi.fn();
    const event = Message<string>((r) => {
      setTimeout(() => r("test value"), 10);
    });

    const sub1 = event.then(mock1); // eslint-disable-line @typescript-eslint/no-unused-vars
    const sub2 = event.then(mock2); // eslint-disable-line @typescript-eslint/no-unused-vars

    // Destroy the main message
    event.destroy();

    // Wait for resolution
    await new Promise((resolve) => setTimeout(resolve, 20));

    // Neither should be called
    expect(mock1).not.toHaveBeenCalled();
    expect(mock2).not.toHaveBeenCalled();
  });

  test("error in one subscription bubbles up to the main event", async () => {
    const catchMock = vi.fn();
    const event = Message<string>((r, reject) => {
      setTimeout(() => reject(new Error("test error")), 10);
    });

    event.catch(catchMock);

    const sub1 = event.then(vi.fn()); // eslint-disable-line @typescript-eslint/no-unused-vars
    const sub2 = event.then(vi.fn()); // eslint-disable-line @typescript-eslint/no-unused-vars

    // Wait for rejection
    await new Promise((resolve) => setTimeout(resolve, 20));

    // The main event's catch should be called
    expect(catchMock).toHaveBeenCalledWith(expect.any(Error));
  });
});
