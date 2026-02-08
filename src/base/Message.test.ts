import { Message } from "base/Message";
import { Void } from "base/Void";
import { Promisify } from "components/Promisify";
import { Shared } from "components/Shared";
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

  test("destructor returned from executor in then does not destroy base message", async () => {
    const cleanup = vi.fn();
    const mock1 = vi.fn();
    const mock2 = vi.fn();
    const mock3 = vi.fn();

    let counter = 0;
    const base = Message<number>((resolve) => {
      const id = setTimeout(() => resolve(++counter), 5);
      // return destructor for this subscription only
      return () => {
        cleanup();
        clearTimeout(id);
      };
    });

    // Subscribe and immediately destroy the subscription
    const sub1 = base.then(mock1);
    sub1.destroy();

    // Create another subscription - base must still work
    const sub2 = base.then(mock2);

    await new Promise((r) => setTimeout(r, 20));

    // First subscription was destroyed before resolution
    expect(mock1).not.toHaveBeenCalled();
    // Second subscription received the value (counter === 1)
    expect(mock2).toHaveBeenCalledWith(1);

    // Destroying first subscription should execute its destructor only
    expect(cleanup).toHaveBeenCalledTimes(1);

    // New subscription after previous destruction should still work and get next value
    const sub3 = base.then(mock3);
    await new Promise((r) => setTimeout(r, 20));
    expect(mock3).toHaveBeenCalledWith(2);

    // Cleanup others triggers their own destructors but not the base
    sub2.destroy();
    sub3.destroy();
    expect(cleanup).toHaveBeenCalledTimes(3);

    // Finally, base can be destroyed without errors
    base.destroy();
  });

  test("rejection on second argument of message", async () => {
    const catchMock = vi.fn();
    const event = Message<string>((r, reject) => {
      setTimeout(() => reject(new Error("test error")), 10);
    });

    event.then(Void(), catchMock);

    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(catchMock).toHaveBeenCalledWith(expect.any(Error));
  });

  test("rejection throw expect", async () => {
    const event = Shared(
      Message((_, reject) => {
        reject(new Error("test error"));
      }),
    );
    await expect(Promisify(event)).rejects.toThrow("test error");
  });
});
