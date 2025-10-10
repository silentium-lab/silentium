import { describe, expect, test, vi } from "vitest";
import { late } from "./Late";

describe("Late.test", () => {
  test("Begins with empty value", () => {
    const l = late<number>();

    const o = vi.fn();
    l.value(o);

    expect(o).not.toHaveBeenCalled();

    l.give(1);

    expect(o).toHaveBeenCalledWith(1);

    l.give(2);

    expect(o).toHaveBeenCalledWith(2);
  });

  test("Begins with 1 value", () => {
    const l = late<number>(1);
    const o = vi.fn();
    l.value(o);

    l.give(2);

    expect(o).toHaveBeenLastCalledWith(2);
  });
});
