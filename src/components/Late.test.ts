import { describe, expect, test, vi } from "vitest";
import { Late } from "components/Late";
import { Transport } from "base/Transport";

describe("Late.test", () => {
  test("Begins with empty value", () => {
    const l = Late<number>();

    const o = vi.fn();
    l.to(Transport(o));

    expect(o).not.toHaveBeenCalled();

    l.use(1);

    expect(o).toHaveBeenCalledWith(1);

    l.use(2);

    expect(o).toHaveBeenCalledWith(2);
  });

  test("Begins with 1 value", () => {
    const l = Late<number>(1);
    const o = vi.fn();
    l.to(Transport(o));

    l.use(2);

    expect(o).toHaveBeenLastCalledWith(2);
  });
});
