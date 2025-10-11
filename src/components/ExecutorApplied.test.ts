import { applied } from "../components/Applied";
import { describe, expect, test } from "vitest";
import { late } from "../components/Late";
import { diagram } from "../testing";
import { executorApplied } from "./ExecutorApplied";

describe("ExecutorApplied.test", () => {
  test("fn applied to value transferring", () => {
    const d = diagram();
    const l = late<number>(1);

    let applierWasCalled = 0;
    const infoLimited = executorApplied(l.event, (owner) => {
      return (v) => {
        if (applierWasCalled < 2) {
          owner(v);
        }
        applierWasCalled += 1;
      };
    });

    applied(infoLimited, String)(d.user);

    l.use(2);
    l.use(3);
    l.use(4);

    expect(d.toString()).toBe("1|2");
  });
});
