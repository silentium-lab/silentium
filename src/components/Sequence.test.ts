import { describe, expect, test, vi } from "vitest";
import { applied } from "./Applied";
import { late } from "./Late";
import { sequence } from "./Sequence";

describe("Sequence.test", () => {
  test("use one by one values", () => {
    const l = late<number>();
    const seq = applied(sequence(l.event), String);

    const o = vi.fn();
    seq(o);

    l.use(1);
    l.use(2);
    l.use(3);
    l.use(4);
    l.use(5);

    expect(o).toHaveBeenLastCalledWith("1,2,3,4,5");
  });
});
