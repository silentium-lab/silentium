import { describe, expect, test, vi } from "vitest";
import { destructor } from "../base/Destructor";
import { of } from "../base/Of";

describe("Destructor.test", () => {
  test("Destructor always exists", () => {
    const src = destructor(of("1"));
    const user = vi.fn();
    const d = src(user);

    expect(user).toHaveBeenCalledWith("1");
    expect(typeof d).toBe("function");
  });

  test("Destructor can be grabbed", () => {
    const destructorUser = vi.fn();
    const d = () => {};
    d.theName = "destructor";
    const src = destructor((user) => {
      user("2");
      return d;
    }, destructorUser);
    const user = vi.fn();
    src(user);

    expect(user).toHaveBeenCalledWith("2");
    expect(destructorUser).toHaveBeenCalledWith(d);
  });
});
