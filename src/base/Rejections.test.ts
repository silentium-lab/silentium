import { describe, expect, test, vi } from "vitest";
import { Rejections } from "base/Rejections";

describe("Rejections.test", () => {
  test("reject calls all catch handlers with the reason", () => {
    const rejections = new Rejections();
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
    const rejections = new Rejections();
    const catcher1 = vi.fn();
    const catcher2 = vi.fn();
    const reason = new Error("test error");

    rejections.catch(catcher1).catch(catcher2).destroy();

    rejections.reject(reason);

    expect(catcher1).not.toHaveBeenCalled();
    expect(catcher2).not.toHaveBeenCalled();
  });
});
