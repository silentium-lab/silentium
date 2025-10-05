import { describe, expect, test, vi } from "vitest";
import { local } from "../base/Local";
import { late } from "../components";

describe("Local.test", () => {
  test("", () => {
    const src = late(1);
    const localSrc = local(src.value);
    const g = vi.fn();
    const d = localSrc(g);

    expect(g).toHaveBeenCalledWith(1);

    src.give(2);

    expect(g).toHaveBeenCalledWith(2);

    d?.();
    src.give(3);

    expect(g).toHaveBeenCalledWith(2);
  });
});
