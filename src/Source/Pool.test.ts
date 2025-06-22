import { expect, test } from "vitest";
import { Guest } from "../Guest";
import { of } from "../Source/Of";
import { pool } from "../Source/Pool";

test("Pool.test", () => {
  const [os, og] = of<number>(1);
  const p = pool(os);
  const responses: string[] = [];

  p.value(
    new Guest((v) => {
      responses.push(`g1_${v}`);
    }),
  );
  p.value(
    new Guest((v) => {
      responses.push(`g2_${v}`);
    }),
  );

  og.give(2);
  og.give(3);
  og.give(4);

  expect(responses).toStrictEqual([
    "g1_1",
    "g2_1",
    "g1_2",
    "g2_2",
    "g1_3",
    "g2_3",
    "g1_4",
    "g2_4",
  ]);
});
