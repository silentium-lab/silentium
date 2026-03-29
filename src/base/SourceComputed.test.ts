import { SourceComputed } from "base/SourceComputed";
import { Any } from "components/Any";
import { Late } from "components/Late";
import { describe, expect, test, vi } from "vitest";

describe("SourceComputed.test", () => {
  test("join many messages and one source", () => {
    const s$ = Late(1);
    const m$ = Late();
    const compound$ = SourceComputed(Any(s$, m$), m$);
    const g = vi.fn();
    compound$.then(g);

    expect(g).toHaveBeenLastCalledWith(1);

    m$.use(4);
    expect(g).toHaveBeenLastCalledWith(4);

    s$.use(5);
    expect(g).toHaveBeenLastCalledWith(5);
  });
});
