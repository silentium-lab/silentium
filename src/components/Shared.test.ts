import { describe, expect, test, vi } from "vitest";
import { Diagram } from "../testing";
import { Late } from "./Late";
import { Shared } from "./Shared";

describe("Shared.test", () => {
  test("many users for one event", () => {
    const d = Diagram();
    const l = Late<number>(1);
    const s = Shared(l.event);

    s.event((v) => {
      d.user(`g1_${v}`);
    });
    s.event((v) => {
      d.user(`g2_${v}`);
    });

    expect(d.toString()).toBe("g1_1|g2_1");

    l.use(2);
    l.use(3);
    l.use(4);

    expect(d.toString()).toBe("g1_1|g2_1|g1_2|g2_2|g1_3|g2_3|g1_4|g2_4");

    s.destroy();
    expect(s.pool().size()).toBe(0);
  });

  test("stateless", () => {
    const l = Late<number>(1);
    const s = Shared(l.event, true);

    const g = vi.fn();
    s.event(g);
    l.use(1);

    expect(g).toBeCalledWith(1);

    const g2 = vi.fn();
    s.event(g2);
    expect(g2).not.toHaveBeenCalled();

    l.use(2);

    expect(g).toBeCalledWith(2);
    expect(g2).toBeCalledWith(2);
  });
});
