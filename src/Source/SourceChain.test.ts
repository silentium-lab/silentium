import { of } from "../Source/Of";
import { expect, test } from "vitest";
import { diagram } from "../../test-utils/diagram";
import { chain } from "../Source/SourceChain";

test("SourceChain.test", () => {
  const [d, dG] = diagram();
  const [triggerSrc, triggerG] = of();
  const [valueSrc, valueG] = of<string>("the_value");

  const valueAfterTrigger = chain(triggerSrc, valueSrc);
  valueAfterTrigger.value(dG);

  expect(d()).toBe("");

  triggerG.give("done");

  expect(d()).toBe("the_value");

  valueG.give("new_value");
  expect(d()).toBe("the_value|new_value");

  triggerG.give("done2");

  expect(d()).toBe("the_value|new_value|new_value");
});
