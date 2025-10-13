import { describe, expect, test, vi } from "vitest";
import { Local } from "../base/Local";
import { Late } from "../components";

describe("Local.test", () => {
  test("local event don't react after destroying", () => {
    const ev = Late(1);
    const localEv = Local(ev.event);
    const g = vi.fn();
    const d = localEv(g);

    expect(g).toHaveBeenCalledWith(1);

    ev.use(2);

    expect(g).toHaveBeenCalledWith(2);

    d?.();
    ev.use(3);

    expect(g).toHaveBeenCalledWith(2);
  });
});
