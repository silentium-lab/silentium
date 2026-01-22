import { Message } from "base/Message";
import { Connected } from "base/Connected";
import { Void } from "base/Void";
import { describe, expect, test, vi } from "vitest";

describe("Connected.test", () => {
  test("resolves when first message resolves", () => {
    const first = Message<string>((resolve) => {
      resolve("hello");
    });

    const second = Message<string>(() => {
      // Second message is not resolved in this test
    });

    const connected = Connected(first, second);

    const resolveSpy = vi.fn();
    const rejectSpy = vi.fn();
    connected.then(resolveSpy).catch(rejectSpy);

    // Should resolve with the first message's value
    expect(resolveSpy).toHaveBeenCalledWith("hello");
    expect(rejectSpy).not.toHaveBeenCalled();
  });

  test("rejects when first message rejects", () => {
    const first = Message<string>((resolve, reject) => {
      reject(new Error("first error"));
    });

    const second = Message<string>((resolve) => {
      // Second message is not resolved in this test
      resolve("1");
    });

    const connected = Connected(first, second);

    const resolveSpy = vi.fn();
    const rejectSpy = vi.fn();
    connected.then(resolveSpy).catch(rejectSpy);

    // Should reject with the first message's error
    expect(rejectSpy).toHaveBeenCalledWith(new Error("first error"));
    expect(resolveSpy).not.toHaveBeenCalled();
  });

  test("rejects when other message rejects", () => {
    const first = Message<string>(() => {
      // First message never resolves
    });

    const second = Message<string>((resolve, reject) => {
      reject(new Error("second error"));
    });

    const connected = Connected(first, second);

    const resolveSpy = vi.fn();
    const rejectSpy = vi.fn();
    connected.then(resolveSpy).catch(rejectSpy);

    // Trigger second's executor
    second.then(() => {});

    // Should reject with the second message's error
    expect(rejectSpy).toHaveBeenCalledWith(new Error("second error"));
    expect(resolveSpy).not.toHaveBeenCalled();
  });

  test("destroys all messages when destructor is called", () => {
    const destroyed: string[] = [];

    const first = Message(() => {
      return () => destroyed.push("first");
    });

    const second = Message(() => {
      return () => destroyed.push("second");
    });

    const third = Message(() => {
      return () => destroyed.push("third");
    });

    const connected = Connected(first, second, third);

    // Trigger the connected executor (which triggers first's executor)
    // and the other messages' executors
    connected.then(Void());
    second.then(Void());
    third.then(Void());

    // Call the destructor
    connected.destroy();

    expect(destroyed).toStrictEqual(["first", "second", "third"]);
  });

  test("works with single message", () => {
    let resolveFirst: (value: string) => void;
    const first = Message<string>((resolve) => {
      resolveFirst = resolve;
    });

    const connected = Connected(first);

    const resolveSpy = vi.fn();
    const rejectSpy = vi.fn();
    connected.then(resolveSpy).catch(rejectSpy);

    // Resolve the first message
    resolveFirst!("single");

    // Should resolve with the value
    expect(resolveSpy).toHaveBeenCalledWith("single");
    expect(rejectSpy).not.toHaveBeenCalled();
  });
});
