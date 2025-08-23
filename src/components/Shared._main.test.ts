import { Diagram } from "../testing";
import { expect, test } from "vitest";
import { Late } from "./Late";
import { Shared } from "./Shared";
import { From } from "src/base";

test("Shared.test", () => {
  const d = new Diagram();
  const l = new Late<number>(1);
  const s = new Shared(l);

  s.value(
    new From((v) => {
      d.owner().give(`g1_${v}`);
    }),
  );
  s.value(
    new From((v) => {
      d.owner().give(`g2_${v}`);
    }),
  );

  expect(d.toString()).toBe("g1_1|g2_1");

  l.owner().give(2);
  l.owner().give(3);
  l.owner().give(4);

  expect(d.toString()).toBe("g1_1|g2_1|g1_2|g2_2|g1_3|g2_3|g1_4|g2_4");

  s.destroy();
  expect(s.pool().size()).toBe(0);
});
