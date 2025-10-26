import { describe, expect, test, vi } from "vitest";
import { Of, User } from "../base";
import { Chain } from "./Chain";
import { Late } from "./Late";
import { TransportApplied } from "../components/TransportApplied";
import { Transport } from "../components/Transport";

describe("ConstructorApplied.test", () => {
  test("apply fn to result", () => {
    const l = new Late();
    const lazyInf = new TransportApplied(
      new Transport((v) => v),
      (i) => new Chain(l, i),
    );
    const inf = lazyInf.of(new Of(1));

    const g = vi.fn();
    inf.event(new User(g));

    expect(g).not.toHaveBeenCalled();

    l.use(1);

    expect(g).toHaveBeenCalledTimes(1);
    expect(g).toBeCalledWith(1);
  });
});
