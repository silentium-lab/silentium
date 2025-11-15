import { describe, expect, test } from "vitest";
import { Applied } from "components/Applied";
import { Late } from "components/Late";
import { ExecutorApplied } from "components/ExecutorApplied";
import { Diagram } from "testing/Diagram";

describe("ExecutorApplied.test", () => {
  test("fn applied to value transferring", () => {
    const d = Diagram();
    const l = Late<number>(1);

    let applierWasCalled = 0;
    const infoLimited = ExecutorApplied(l, (u) => {
      return (v) => {
        if (applierWasCalled < 2) {
          u(v);
        }
        applierWasCalled += 1;
      };
    });

    Applied(infoLimited, String).to(d.transport);

    l.use(2);
    l.use(3);
    l.use(4);

    expect(d.toString()).toBe("1|2");
  });
});
