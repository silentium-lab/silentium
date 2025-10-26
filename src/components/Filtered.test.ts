import { describe, expect, test, vitest } from "vitest";
import { Of, User } from "../base";
import { Filtered } from "./Filtered";

describe("Filtered.test", () => {
  test("filtered main process", () => {
    const info = new Filtered(new Of(11), (v) => v === 11);

    const g1 = vitest.fn();
    info.event(new User(g1));
    expect(g1).toBeCalledWith(11);

    const info2 = new Filtered(new Of(11), (v) => v === 22);

    const g2 = vitest.fn();
    info2.event(new User(g2));
    expect(g2).not.toHaveBeenCalled();
  });

  test("filtering with default value", () => {
    const info = new Filtered(new Of(11), (v) => v === 11);

    const g1 = vitest.fn();
    info.event(new User(g1));
    expect(g1).toBeCalledWith(11);

    const info2 = new Filtered(new Of(11), (v) => v === 22, 33);

    const g2 = vitest.fn();
    info2.event(new User(g2));
    expect(g2).toBeCalledWith(33);
  });
});
