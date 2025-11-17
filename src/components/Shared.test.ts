import { describe, expect, test, vi } from "vitest";
import { Late } from "components/Late";
import { Shared } from "components/Shared";
import { Diagram } from "testing/Diagram";
import { Tap } from "base/Tap";

describe("Shared.test", () => {
  test("many users for one message", () => {
    const d = Diagram();
    const l = Late<number>(1);
    const s = Shared(l);

    s.pipe(
      Tap((v) => {
        d.tap.use(`g1_${v}`);
      }),
    );
    s.pipe(
      Tap((v) => {
        d.tap.use(`g2_${v}`);
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
    const l = Late<number>(1);
    const s = Shared(l, true);

    const g = vi.fn();
    s.pipe(Tap(g));
    l.use(1);

    expect(g).toBeCalledWith(1);

    const g2 = vi.fn();
    s.pipe(Tap(g2));
    expect(g2).not.toHaveBeenCalled();

    l.use(2);

    expect(g).toBeCalledWith(2);
    expect(g2).toBeCalledWith(2);
  });
});
