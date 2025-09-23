import { expect, test } from "vitest";
import { Diagram } from "../testing";
import { Chain } from "./Chain";
import { Late } from "./Late";
import { Destroyable } from "../base";

test("infoChain.test", () => {
  const d = new Diagram();
  const triggerSrc = new Late<string>("immediate");
  const valueSrc = new Late<string>("the_value");

  const valueAfterTrigger = new Chain(triggerSrc, valueSrc);
  valueAfterTrigger.value(d.owner());

  expect(d.toString()).toBe("the_value");

  triggerSrc.give("done");

  expect(d.toString()).toBe("the_value|the_value");

  valueSrc.give("new_value");
  expect(d.toString()).toBe("the_value|the_value|new_value");

  triggerSrc.give("done2");

  expect(d.toString()).toBe("the_value|the_value|new_value|new_value");

  valueAfterTrigger.destroy();
  const destroyable = Destroyable;
  expect(destroyable.getInstancesCount()).toBe(0);
});
