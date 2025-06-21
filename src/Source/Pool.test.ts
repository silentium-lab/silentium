import { expect, test } from "vitest";
import { Guest } from "../Guest";
import { of } from "../Source/Of";
import { pool } from "../Source/Pool";

test("Pool.test", () => {
  const o = of<number>(1);
  const p = pool(o);
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

  o.next(2);
  o.next(3);
  o.next(4);

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
