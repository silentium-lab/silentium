import { describe, expect, test, vi } from "vitest";
import { Of } from "../base/Of";
import { Any } from "./Any";
import { Late } from "./Late";
import { User } from "../base";

describe("Any.test", () => {
  test("event what responds from any connected event", () => {
    const l = new Late<number>();
    const d = new Of("default");

    const anyI = new Any<string | number>(l, d);

    const o = vi.fn();
    anyI.event(new User(o));

    expect(o).toHaveBeenCalledWith("default");

    l.use(999);

    expect(o).toBeCalledWith(999);
  });
});
