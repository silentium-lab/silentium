import { expect, test } from "vitest";
import { applied } from "../Information/Applied";
import { sequence } from "../Information/Sequence";
import { ownerSync } from "../Owner";
import { of } from "./Of";

test("Sequence.test", () => {
  const [os, og] = of<number>();
  const seq = ownerSync(applied(sequence(os), String));

  og.give(1);
  og.give(2);
  og.give(3);
  og.give(4);
  og.give(5);

  expect(seq.syncValue()).toBe("1,2,3,4,5");
});
