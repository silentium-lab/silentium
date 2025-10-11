import { describe, expect, test, vi } from "vitest";
import { of } from "../base/Of";
import { any } from "./Any";
import { late } from "./Late";

describe("Any.test", () => {
  test("event what responds from any connected event", () => {
    const l = late<number>();
    const d = of("default");

    const anyI = any<string | number>(l.event, d);

    const o = vi.fn();
    anyI(o);

    expect(o).toHaveBeenCalledWith("default");

    l.use(999);

    expect(o).toBeCalledWith(999);
  });
});
