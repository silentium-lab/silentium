import { expect, test, vi } from "vitest";
import { applied } from "./Applied";
import { late } from "./Late";
import { sequence } from "./Sequence";

test("Sequence.test", () => {
  const l = late<number>();
  const seq = applied(sequence(l.value), String);

  const o = vi.fn();
  seq(o);

  l.give(1);
  l.give(2);
  l.give(3);
  l.give(4);
  l.give(5);

  expect(o).toBeCalledWith("1,2,3,4,5");
});
