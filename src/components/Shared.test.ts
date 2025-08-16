import { diagram } from "../testing";
import { expect, test } from "vitest";
import { of } from "./Of";
import { shared } from "./Shared";

test("Shared.test", () => {
  const [d, dG] = diagram();
  const [os, og] = of<number>(1);
  const [p, pDestroy, pool] = shared(os);

  p((v) => {
    dG(`g1_${v}`);
  });
  p((v) => {
    dG(`g2_${v}`);
  });

  expect(d()).toBe("g1_1|g2_1");

  og(2);
  og(3);
  og(4);

  expect(d()).toBe("g1_1|g2_1|g1_2|g2_2|g1_3|g2_3|g1_4|g2_4");

  pDestroy();
  expect(pool.size()).toBe(0);
});
