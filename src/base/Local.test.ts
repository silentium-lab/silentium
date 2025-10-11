import { describe, expect, test, vi } from "vitest";
import { local } from "../base/Local";
import { late } from "../components";

describe("Local.test", () => {
  test("local event don't react after destroying", () => {
    const ev = late(1);
    const localEv = local(ev.event);
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
