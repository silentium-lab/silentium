import { Applied } from "../components/Applied";
import { describe, expect, test } from "vitest";
import { Late } from "../components/Late";
import { Diagram } from "../testing";
import { ExecutorApplied } from "./ExecutorApplied";

describe("ExecutorApplied.test", () => {
  test("fn applied to value transferring", () => {
    const d = Diagram();
    const l = Late<number>(1);

    let applierWasCalled = 0;
    const infoLimited = ExecutorApplied(l.event, (owner) => {
      return (v) => {
        if (applierWasCalled < 2) {
          owner(v);
        }
        applierWasCalled += 1;
      };
    });

    Applied(infoLimited, String)(d.user);

    l.use(2);
    l.use(3);
    l.use(4);

    expect(d.toString()).toBe("1|2");
  });
});
