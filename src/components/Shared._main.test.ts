import { expect, test } from "vitest";
import { diagram } from "../testing";
import { late } from "./Late";
import { shared } from "./Shared";

test("Shared.test", () => {
  const d = diagram();
  const l = late<number>(1);
  const s = shared(l.value);

  s.value((v) => {
    d.user(`g1_${v}`);
  });
  s.value((v) => {
    d.user(`g2_${v}`);
  });

  expect(d.toString()).toBe("g1_1|g2_1");

  l.give(2);
  l.give(3);
  l.give(4);

  expect(d.toString()).toBe("g1_1|g2_1|g1_2|g2_2|g1_3|g2_3|g1_4|g2_4");

  s.destroy();
  expect(s.pool().size()).toBe(0);
});
