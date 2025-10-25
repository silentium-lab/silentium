import { describe, expect, test, vi } from "vitest";
import { Of } from "../base";
import { ConstructorArgs } from "./TransportArgs";

describe("ConstructorArgs.test", () => {
  test("construct event of needed args", () => {
    const g = vi.fn();
    const p = ConstructorArgs((...a: unknown[]) => Of(a), [2, 3], 2);
    p(1)(g);

    expect(g).toHaveBeenLastCalledWith([1, undefined, 2, 3]);

    p(1, 2)(g);

    expect(g).toHaveBeenLastCalledWith([1, 2, 2, 3]);

    p(1, 9, 11)(g);

    expect(g).toHaveBeenLastCalledWith([1, 9, 2, 3]);
  });
});
