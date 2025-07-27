import { expect, test, vi } from "vitest";
import { of } from "./Of";
import { applied } from "./Applied";
import { sequence } from "./Sequence";

test("Sequence.test", () => {
  const [os, og] = of<number>();
  const seq = applied(sequence(os), String);

  const o = vi.fn();
  seq(o);

  og(1);
  og(2);
  og(3);
  og(4);
  og(5);

  expect(o).toBeCalledWith("1,2,3,4,5");
});
