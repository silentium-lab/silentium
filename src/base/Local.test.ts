import { describe, expect, test, vi } from "vitest";
import { Local } from "base/Local";
import { Tap } from "base/Tap";
import { Late } from "components/Late";

describe("Local.test", () => {
  test("local message don't react after destroying", () => {
    const ev = Late(1);
    const localEv = Local(ev);
    const g = vi.fn();
    const d = localEv.pipe(Tap(g));

    expect(g).toHaveBeenCalledWith(1);

    ev.use(2);

    expect(g).toHaveBeenCalledWith(2);

    d.destroy();
    ev.use(3);

    expect(g).toHaveBeenCalledWith(2);
  });

  test("local message of raw value", () => {
    const localEv = Local(1);
    const g = vi.fn();
    localEv.pipe(Tap(g));

    expect(g).toHaveBeenCalledWith(1);
  });
});
