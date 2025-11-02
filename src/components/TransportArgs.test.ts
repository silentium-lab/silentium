import { describe, expect, test, vi } from "vitest";
import { TransportArgs } from "components/TransportArgs";
import { Transport, TransportEvent } from "base/Transport";
import { Of } from "base/Of";

describe("TransportArgs.test", () => {
  test("construct event of needed args", () => {
    const g = vi.fn();
    const user = Transport(g);
    const p = TransportArgs(
      TransportEvent((a: any[]) => Of<unknown>(a)),
      [2, 3],
      2,
    );
    p.use([1]).event(user);

    expect(g).toHaveBeenLastCalledWith([1, undefined, 2, 3]);

    p.use([1, 2]).event(user);

    expect(g).toHaveBeenLastCalledWith([1, 2, 2, 3]);

    p.use([1, 9, 11]).event(user);

    expect(g).toHaveBeenLastCalledWith([1, 9, 2, 3]);
  });
});
