import { describe, expect, test, vi } from "vitest";
import { Chain } from "components/Chain";
import { Late } from "components/Late";
import { TapApplied } from "components/TapApplied";
import { Tap, TapMessage } from "base/Tap";
import { Of } from "base/Of";

describe("TapApplied.test", () => {
  test("apply fn to result", () => {
    const l = Late();
    const lazyInf = TapApplied(
      TapMessage((v) => v),
      (i) => Chain(l, i),
    );
    const inf = lazyInf.use(Of(1));

    const g = vi.fn();
    inf.pipe(Tap(g));

    expect(g).not.toHaveBeenCalled();

    l.use(1);

    expect(g).toHaveBeenCalledTimes(1);
    expect(g).toBeCalledWith(1);
  });
});
