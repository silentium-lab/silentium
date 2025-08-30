import { expect, test, vi } from "vitest";
import { Late } from "./Late";
import { Applied } from "./Applied";
import { Sequence } from "./Sequence";
import { From } from "../base";

test("Sequence.test", () => {
  const l = new Late<number>();
  const seq = new Applied(new Sequence(l), String);

  const o = vi.fn();
  seq.value(new From(o));

  l.give(1);
  l.give(2);
  l.give(3);
  l.give(4);
  l.give(5);

  expect(o).toBeCalledWith("1,2,3,4,5");
});
