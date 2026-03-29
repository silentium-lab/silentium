import { describe, expect, test, vi } from "vitest";
import { Rejections } from "base/Rejections";
import { Message } from "base/Message";
import { Void } from "base/Void";
import { Applied } from "components/Applied";

describe("Rejections.test", () => {
  test("reject calls all catch handlers with the reason", () => {
    const rejections = Rejections();
    const catcher1 = vi.fn();
    const catcher2 = vi.fn();
    const reason = new Error("test error");

    rejections.catch(catcher1).catch(catcher2);

    rejections.reject(reason);

    expect(catcher1).toHaveBeenCalledTimes(1);
    expect(catcher1).toHaveBeenCalledWith(reason);
    expect(catcher2).toHaveBeenCalledTimes(1);
    expect(catcher2).toHaveBeenCalledWith(reason);
  });

  test("destroy clears all handlers and reject does not call them", () => {
    const rejections = Rejections();
    const catcher1 = vi.fn();
    const catcher2 = vi.fn();
    const reason = new Error("test error");

    rejections.catch(catcher1).catch(catcher2).destroy();

    rejections.reject(reason);

    expect(catcher1).not.toHaveBeenCalled();
    expect(catcher2).not.toHaveBeenCalled();
  });

  test("Message unhandled rejection", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const m = Message((_, reject) => {
      reject("Error inside message");
    });
    m.then(Void());

    expect(consoleSpy).toHaveBeenCalledWith(
      "Unhandled Message Rejection: Error inside message",
    );

    consoleSpy.mockRestore();
  });

  test("Message nested unhandled rejection", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const m = Applied(
      Message<number>((_, reject) => {
        reject("Error throw applied");
      }),
      (x: number) => x * 2,
    );
    m.then(Void());

    expect(consoleSpy).toHaveBeenCalledWith(
      "Unhandled Message Rejection: Error throw applied",
    );

    consoleSpy.mockRestore();
  });
});
