import { describe, expect, test, vi } from "vitest";
import { Applied } from "./Applied";
import { Late } from "./Late";
import { Sequence } from "./Sequence";
import { Transport } from "../base/Transport";

describe("Sequence.test", () => {
  test("use one by one values", () => {
    const l = Late<number>();
    const seq = Applied(Sequence(l), String);

    const o = vi.fn();
    seq.event(Transport(o));

    l.use(1);
    l.use(2);
    l.use(3);
    l.use(4);
    l.use(5);

    expect(o).toHaveBeenLastCalledWith("1,2,3,4,5");
  });
});
