import { of } from "./Of";
import { expect, test } from "vitest";
import { executorApplied } from "./ExecutorApplied";
import { diagram } from "../testing";

test("infoExecutorApplied.test", () => {
  const [d, dG] = diagram();
  const [info, owner] = of<number>(1);

  let applierWasCalled = 0;
  const infoLimited = executorApplied(info, (owner) => {
    return (v) => {
      if (applierWasCalled < 2) {
        owner(v);
      }
      applierWasCalled += 1;
    };
  });

  infoLimited(dG);

  owner(2);
  owner(3);
  owner(4);

  expect(d()).toBe("1|2");
});
