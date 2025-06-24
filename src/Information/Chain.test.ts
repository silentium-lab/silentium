import { of } from "./Of";
import { expect, test } from "vitest";
import { diagram } from "../../testing/diagram";
import { chain } from "./Chain";

test("infoChain.test", () => {
  const [d, dG] = diagram();
  const [triggerI, triggerG] = of();
  const [valueI, valueG] = of<string>("the_value");

  const valueAfterTrigger = chain(triggerI, valueI);
  valueAfterTrigger.value(dG);

  expect(d()).toBe("");

  triggerG.give("done");

  expect(d()).toBe("the_value");

  valueG.give("new_value");
  expect(d()).toBe("the_value|new_value");

  triggerG.give("done2");

  expect(d()).toBe("the_value|new_value|new_value");
});
