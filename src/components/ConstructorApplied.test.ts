import { describe, expect, test, vi } from "vitest";
import { Of } from "../base";
import { Chain } from "./Chain";
import { Late } from "./Late";
import { ConstructorApplied } from "./TransportApplied";

describe("ConstructorApplied.test", () => {
  test("apply fn to result", () => {
    const l = Late();
    const lazyInf = ConstructorApplied(
      (v) => v,
      (i) => Chain(l.event, i),
    );
    const inf = lazyInf(Of(1));

    const g = vi.fn();
    inf(g);

    expect(g).not.toHaveBeenCalled();

    l.use(1);

    expect(g).toHaveBeenCalledTimes(1);
    expect(g).toBeCalledWith(1);
  });
});
