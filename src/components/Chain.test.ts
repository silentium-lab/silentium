import { expect, test } from "vitest";
import { diagram } from "../testing";
import { chain } from "./Chain";
import { late } from "./Late";

test("infoChain.test", () => {
  const d = diagram();
  const triggerSrc = late<string>("immediate");
  const valueSrc = late<string>("the_value");

  const valueAfterTrigger = chain(triggerSrc.value, valueSrc.value);
  valueAfterTrigger(d.user);

  expect(d.toString()).toBe("the_value");

  triggerSrc.give("done");

  expect(d.toString()).toBe("the_value|the_value");

  valueSrc.give("new_value");
  expect(d.toString()).toBe("the_value|the_value|new_value");

  triggerSrc.give("done2");

  expect(d.toString()).toBe("the_value|the_value|new_value|new_value");
});
