import { expect, test } from "vitest";
import { O } from "../Owner";
import { of } from "./Of";
import { pool } from "./Pool";
import { diagram } from "../../testing/diagram";

test("Pool.test", () => {
  const [d, dG] = diagram();
  const [os, og] = of<number>(1);
  const [p, pp] = pool(os);

  p.value(
    O((v) => {
      dG.give(`g1_${v}`);
    }),
  );
  p.value(
    O((v) => {
      dG.give(`g2_${v}`);
    }),
  );

  expect(d()).toBe("g1_1|g2_1");

  og.give(2);
  og.give(3);
  og.give(4);

  expect(d()).toBe("g1_1|g2_1|g1_2|g2_2|g1_3|g2_3|g1_4|g2_4");

  p.destroy();
  expect(pp.size()).toBe(0);
});
