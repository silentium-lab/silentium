import { expect, test } from "vitest";
import { G } from "../Guest";
import { of } from "../Source/Of";
import { pool } from "../Source/Pool";
import { diagram } from "../../test-utils/diagram";

test("Pool.test", () => {
  const [d, dG] = diagram();
  const [os, og] = of<number>(1);
  const [p, pp] = pool(os);

  p.value(
    G((v) => {
      dG.give(`g1_${v}`);
    }),
  );
  p.value(
    G((v) => {
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
