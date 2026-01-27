import { describe, expect, test, vi } from "vitest";
import { Late } from "components/Late";

describe("Late.test", () => {
  test("Begins with empty value", () => {
    const l = Late<number>();

    const o = vi.fn();
    l.then(o);

    expect(o).not.toHaveBeenCalled();

    l.use(1);

    expect(o).toHaveBeenCalledWith(1);

    l.use(2);

    expect(o).toHaveBeenCalledWith(2);
  });

  test("Begins with 1 value", () => {
    const l = Late<number>(1);
    const o = vi.fn();
    l.then(o);

    l.use(2);

    expect(o).toHaveBeenLastCalledWith(2);
  });

  test("Many thens and destroy", () => {
    const l = Late<number>(1);

    const sub1 = l.then((v) => {
      expect(v).toBe(1);
    });

    l.use(2);
    sub1.destroy();

    l.then((v) => {
      expect(v).toBe(2);
    });
  });
});
