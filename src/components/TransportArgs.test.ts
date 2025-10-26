import { describe, expect, test, vi } from "vitest";
import { Of, User } from "../base";
import { TransportArgs } from "../components/TransportArgs";
import { Transport } from "../components/Transport";

describe("TransportArgs.test", () => {
  test("construct event of needed args", () => {
    const g = vi.fn();
    const user = new User(g);
    const p = new TransportArgs(
      new Transport((...a: any[]) => new Of<unknown>(a)),
      [2, 3],
      2,
    );
    p.of(1).event(user);

    expect(g).toHaveBeenLastCalledWith([1, undefined, 2, 3]);

    p.of(1, 2).event(user);

    expect(g).toHaveBeenLastCalledWith([1, 2, 2, 3]);

    p.of(1, 9, 11).event(user);

    expect(g).toHaveBeenLastCalledWith([1, 9, 2, 3]);
  });
});
