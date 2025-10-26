import { describe, expect, test, vi } from "vitest";
import { Applied } from "./Applied";
import { LateShared } from "./LateShared";
import { Primitive } from "./Primitive";
import { User } from "../base";

describe("PrimitiveSource.test", () => {
  test("primitive reference change", () => {
    const l = new LateShared(1);
    const p = new Primitive(l);
    const l2 = new LateShared(2);

    const r = new Applied(l2, (a) => ["ev", p, a].join("_"));
    const g = vi.fn();
    r.event(new User(g));

    expect(g).toHaveBeenLastCalledWith("ev_1_2");

    l.use(3);
    expect(g).toHaveBeenLastCalledWith("ev_1_2");

    l2.use(4);
    expect(g).toHaveBeenLastCalledWith("ev_3_4");
  });
});
