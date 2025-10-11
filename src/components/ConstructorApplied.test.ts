import { describe, expect, test, vi } from "vitest";
import { of } from "../base";
import { chain } from "./Chain";
import { late } from "./Late";
import { constructorApplied } from "./ConstructorApplied";

describe("ConstructorApplied.test", () => {
  test("apply fn to result", () => {
    const l = late();
    const lazyInf = constructorApplied(
      (v) => v,
      (i) => chain(l.event, i),
    );
    const inf = lazyInf(of(1));

    const g = vi.fn();
    inf(g);

    expect(g).not.toHaveBeenCalled();

    l.use(1);

    expect(g).toHaveBeenCalledTimes(1);
    expect(g).toBeCalledWith(1);
  });
});
