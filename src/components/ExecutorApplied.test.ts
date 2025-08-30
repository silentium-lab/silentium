import { expect, test } from "vitest";
import { ExecutorApplied } from "./ExecutorApplied";
import { Diagram } from "../testing";
import { Late } from "../components/Late";

test("infoExecutorApplied.test", () => {
  const d = new Diagram();
  const l = new Late<number>(1);

  let applierWasCalled = 0;
  const infoLimited = new ExecutorApplied(l, (owner) => {
    return (v) => {
      if (applierWasCalled < 2) {
        owner(v);
      }
      applierWasCalled += 1;
    };
  });

  infoLimited.value(d.owner());

  l.give(2);
  l.give(3);
  l.give(4);

  expect(d.toString()).toBe("1|2");
});
