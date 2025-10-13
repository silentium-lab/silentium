import { describe, expect, test, vi } from "vitest";
import { Destructor } from "../base/Destructor";
import { Of } from "../base/Of";

describe("Destructor.test", () => {
  test("Destructor always exists", () => {
    const ev = Destructor(Of("1"));
    const user = vi.fn();
    const d = ev.event(user);

    expect(user).toHaveBeenCalledWith("1");
    expect(typeof d).toBe("function");
  });

  test("Destructor can be grabbed", () => {
    const destructorUser = vi.fn();
    const d = () => {};
    d.theName = "destructor";
    const ev = Destructor((user) => {
      user("2");
      return d;
    }, destructorUser);
    const user = vi.fn();
    ev.event(user);

    expect(user).toHaveBeenCalledWith("2");
  });
});
