import { describe, expect, test, vi } from "vitest";
import { TapArgs } from "components/TapArgs";
import { Tap, TapMessage } from "base/Tap";
import { Of } from "base/Of";

describe("TapArgs.test", () => {
  test("construct message of needed args", () => {
    const g = vi.fn();
    const user = Tap(g);
    const p = TapArgs(
      TapMessage((a: any[]) => Of<unknown>(a)),
      [2, 3],
      2,
    );
    p.use([1]).pipe(user);

    expect(g).toHaveBeenLastCalledWith([1, undefined, 2, 3]);

    p.use([1, 2]).pipe(user);

    expect(g).toHaveBeenLastCalledWith([1, 2, 2, 3]);

    p.use([1, 9, 11]).pipe(user);

    expect(g).toHaveBeenLastCalledWith([1, 9, 2, 3]);
  });
});
