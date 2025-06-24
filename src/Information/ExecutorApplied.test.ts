import { of } from "./Of";
import { expect, test } from "vitest";
import { diagram } from "../../testing/diagram";
import { Owner } from "../Owner/Owner";
import { executorApplied } from "./ExecutorApplied";

test("infoExecutorApplied.test", () => {
  const [d, dG] = diagram();
  const [info, owner] = of<number>(1);

  let applierWasCalled = 0;
  const infoDebounced = executorApplied(info, (owner) => {
    return new Owner((v) => {
      if (applierWasCalled < 2) {
        owner.give(v);
      }
      applierWasCalled += 1;
    });
  });

  infoDebounced.value(dG);

  owner.give(2);
  owner.give(3);
  owner.give(4);

  expect(d()).toBe("1|2");
});
