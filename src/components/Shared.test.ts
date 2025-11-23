import { describe, expect, test } from "vitest";
import { Late } from "components/Late";
import { Shared } from "components/Shared";
import { Diagram } from "testing/Diagram";

describe("Shared.test", () => {
  test("many users for one message", () => {
    const d = Diagram();
    const l = Late<number>(1);
    const s = Shared(l);

    s.then((v) => {
      d.resolver(`g1_${v}`);
    });
    s.then((v) => {
      d.resolver(`g2_${v}`);
    });

    expect(d.toString()).toBe("g1_1|g2_1");

    l.use(2);
    l.use(3);
    l.use(4);

    expect(d.toString()).toBe("g1_1|g2_1|g1_2|g2_2|g1_3|g2_3|g1_4|g2_4");

    s.destroy();
  });

  test("chain method forwards messages to shared", () => {
    const d = Diagram();
    const s = Shared(Late<number>());
    const m = Late<number>();

    s.then((v) => {
      d.resolver(`shared_${v}`);
    });

    s.chain(m);

    m.use(42);
    m.use(99);

    expect(d.toString()).toBe("shared_42|shared_99");

    s.destroy();
  });
});
