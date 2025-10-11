import { describe, expect, test, vi } from "vitest";
import { applied } from "../components/Applied";
import { lateShared } from "../components/LateShared";
import { primitive } from "../components/PrimitiveSource";

describe("PrimitiveSource.test", () => {
  test("primitive reference change", () => {
    const l = lateShared(1);
    const p = primitive(l.event);
    const l2 = lateShared(2);

    const r = applied(l2.event, (a) => ["ev", p, a].join("_"));
    const g = vi.fn();
    r(g);

    expect(g).toHaveBeenLastCalledWith("ev_1_2");

    l.use(3);
    expect(g).toHaveBeenLastCalledWith("ev_1_2");

    l2.use(4);
    expect(g).toHaveBeenLastCalledWith("ev_3_4");
  });
});
