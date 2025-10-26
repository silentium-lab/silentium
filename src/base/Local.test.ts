import { describe, expect, test, vi } from "vitest";
import { Local } from "../base/Local";
import { Late } from "../components";
import { User } from "../base/User";

describe("Local.test", () => {
  test("local event don't react after destroying", () => {
    const ev = new Late(1);
    const localEv = Local(ev);
    const g = vi.fn();
    const d = localEv.event(User(g));

    expect(g).toHaveBeenCalledWith(1);

    ev.use(2);

    expect(g).toHaveBeenCalledWith(2);

    d.destroy();
    ev.use(3);

    expect(g).toHaveBeenCalledWith(2);
  });
});
