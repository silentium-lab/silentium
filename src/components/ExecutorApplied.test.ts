import { Applied } from "../components/Applied";
import { describe, expect, test } from "vitest";
import { Late } from "../components/Late";
import { Diagram } from "../testing";
import { ExecutorApplied } from "./ExecutorApplied";
import { User } from "../base";

describe("ExecutorApplied.test", () => {
  test("fn applied to value transferring", () => {
    const d = Diagram();
    const l = new Late<number>(1);

    let applierWasCalled = 0;
    const infoLimited = new ExecutorApplied(l, (u) => {
      return new User((v) => {
        if (applierWasCalled < 2) {
          u.use(v);
        }
        applierWasCalled += 1;
      });
    });

    new Applied(infoLimited, String).event(d.user);

    l.use(2);
    l.use(3);
    l.use(4);

    expect(d.toString()).toBe("1|2");
  });
});
