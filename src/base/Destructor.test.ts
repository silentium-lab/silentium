import { describe, expect, test, vi } from "vitest";
import { destructor } from "../base/Destructor";
import { of } from "../base/Of";

describe("Destructor.test", () => {
  test("Destructor always exists", () => {
    const ev = destructor(of("1"));
    const user = vi.fn();
    const d = ev.value(user);

    expect(user).toHaveBeenCalledWith("1");
    expect(typeof d).toBe("function");
  });

  test("Destructor can be grabbed", () => {
    const destructorUser = vi.fn();
    const d = () => {};
    d.theName = "destructor";
    const ev = destructor((user) => {
      user("2");
      return d;
    }, destructorUser);
    const user = vi.fn();
    ev.value(user);

    expect(user).toHaveBeenCalledWith("2");
  });
});
