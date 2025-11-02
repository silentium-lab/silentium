import { describe, expect, test, vi } from "vitest";
import { Chain } from "./Chain";
import { Late } from "./Late";
import { TransportApplied } from "../components/TransportApplied";
import { Transport, TransportEvent } from "../base/Transport";
import { Of } from "../base/Of";

describe("TransportApplied.test", () => {
  test("apply fn to result", () => {
    const l = Late();
    const lazyInf = TransportApplied(
      TransportEvent((v) => v),
      (i) => Chain(l, i),
    );
    const inf = lazyInf.use(Of(1));

    const g = vi.fn();
    inf.event(Transport(g));

    expect(g).not.toHaveBeenCalled();

    l.use(1);

    expect(g).toHaveBeenCalledTimes(1);
    expect(g).toBeCalledWith(1);
  });
});
