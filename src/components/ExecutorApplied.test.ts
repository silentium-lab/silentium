import { applied } from "../components/Applied";
import { expect, test } from "vitest";
import { late } from "../components/Late";
import { diagram } from "../testing";
import { executorApplied } from "./ExecutorApplied";

test("ExecutorApplied.test", () => {
  const d = diagram();
  const l = late<number>(1);

  let applierWasCalled = 0;
  const infoLimited = executorApplied(l.value, (owner) => {
    return (v) => {
      if (applierWasCalled < 2) {
        owner(v);
      }
      applierWasCalled += 1;
    };
  });

  applied(infoLimited, String)(d.user);

  l.give(2);
  l.give(3);
  l.give(4);

  expect(d.toString()).toBe("1|2");
});
