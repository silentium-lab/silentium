import { describe, expect, test, vi } from "vitest";
import { Applied } from "components/Applied";
import { LateShared } from "components/LateShared";
import { Primitive } from "components/Primitive";
import { Tap } from "base/Tap";

describe("PrimitiveSource.test", () => {
  test("primitive reference change", () => {
    const l = LateShared(1);
    const p = Primitive(l);
    const l2 = LateShared(2);

    const r = Applied(l2, (a) => ["ev", p, a].join("_"));
    const g = vi.fn();
    r.pipe(Tap(g));

    expect(g).toHaveBeenLastCalledWith("ev_1_2");

    l.use(3);
    expect(g).toHaveBeenLastCalledWith("ev_1_2");

    l2.use(4);
    expect(g).toHaveBeenLastCalledWith("ev_3_4");
  });
});
