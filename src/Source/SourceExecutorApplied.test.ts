import { of } from "../Source/Of";
import { expect, test } from "vitest";
import { diagram } from "../../test-utils/diagram";
import { Guest } from "../Guest/Guest";
import { executorApplied } from "../Source/SourceExecutorApplied";

test("SourceExecutorApplied.test", () => {
  const [d, dG] = diagram();
  const [source, guest] = of<number>(1);

  let applierWasCalled = 0;
  const sourceDebounced = executorApplied(source, (guest) => {
    return new Guest((v) => {
      if (applierWasCalled < 2) {
        guest.give(v);
      }
      applierWasCalled += 1;
    });
  });

  sourceDebounced.value(dG);

  guest.give(2);
  guest.give(3);
  guest.give(4);

  expect(d()).toBe("1|2");
});
