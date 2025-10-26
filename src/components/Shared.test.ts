import { describe, expect, test, vi } from "vitest";
import { Diagram } from "../testing";
import { Late } from "./Late";
import { Shared } from "./Shared";
import { User } from "../base";

describe("Shared.test", () => {
  test("many users for one event", () => {
    const d = Diagram();
    const l = new Late<number>(1);
    const s = new Shared(l);

    s.event(
      new User((v) => {
        d.user.use(`g1_${v}`);
      }),
    );
    s.event(
      new User((v) => {
        d.user.use(`g2_${v}`);
      }),
    );

    expect(d.toString()).toBe("g1_1|g2_1");

    l.use(2);
    l.use(3);
    l.use(4);

    expect(d.toString()).toBe("g1_1|g2_1|g1_2|g2_2|g1_3|g2_3|g1_4|g2_4");

    s.destroy();
    expect(s.pool().size()).toBe(0);
  });

  test("stateless", () => {
    const l = new Late<number>(1);
    const s = new Shared(l, true);

    const g = vi.fn();
    s.event(new User(g));
    l.use(1);

    expect(g).toBeCalledWith(1);

    const g2 = vi.fn();
    s.event(new User(g2));
    expect(g2).not.toHaveBeenCalled();

    l.use(2);

    expect(g).toBeCalledWith(2);
    expect(g2).toBeCalledWith(2);
  });
});
