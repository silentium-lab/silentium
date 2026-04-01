import { describe, expect, test, vi } from "vitest";
import { Late } from "components/Late";
import { Diagram } from "testing/Diagram";

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

  test("Destroy subscription", () => {
    const m$ = Late(1);
    const g = vi.fn();
    const sub = m$.then(g);
    expect(g).toBeCalledTimes(1);
    sub.destroy();
    m$.use(2);
    expect(g).toBeCalledTimes(1);
  });

  test("duplicate value", () => {
    const d = Diagram();
    const $l = Late(1);

    $l.then(d.resolver);
    $l.use(2);
    $l.use(2);
    $l.use(2);

    expect(d.toString()).toBe("1|2");

    $l.use(3);
    expect(d.toString()).toBe("1|2|3");
  });

  test("falsy change", () => {
    const $l = Late(false);
    const g = vi.fn();
    $l.then(g);

    expect(g).toHaveBeenLastCalledWith(false);

    $l.use(true);
    expect(g).toHaveBeenLastCalledWith(true);

    $l.use(false);
    expect(g).toHaveBeenLastCalledWith(false);
  });
});
