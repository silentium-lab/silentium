import { of } from "./Of";
import { expect, test } from "vitest";
import { diagram } from "../testing";
import { chain } from "./Chain";

test("infoChain.test", () => {
  const [d, dG] = diagram();
  const [triggerI, triggerG] = of<string>("immediate");
  const [valueI, valueG] = of<string>("the_value");

  const valueAfterTrigger = chain(triggerI, valueI);
  valueAfterTrigger(dG);

  expect(d()).toBe("the_value");

  triggerG("done");

  expect(d()).toBe("the_value|the_value");

  valueG("new_value");
  expect(d()).toBe("the_value|the_value|new_value");

  triggerG("done2");

  expect(d()).toBe("the_value|the_value|new_value|new_value");
});
