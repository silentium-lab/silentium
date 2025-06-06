import { sourceChain } from "../Source/SourceChain";
import { expect, test } from "vitest";
import { sourceSync } from "../Source/SourceSync";
import { sourceOf } from "./SourceChangeable";
import { patron } from "../Patron/Patron";

test("SourceChain.test", () => {
  const triggerSrc = sourceOf();
  const valueSrc = sourceOf<string>("the-value");

  const valueAfterTrigger = sourceSync(
    sourceChain(triggerSrc, valueSrc),
    "no-value",
  );
  let callsCounter = "";
  valueAfterTrigger.value(
    patron((v) => {
      callsCounter += "," + v;
    }),
  );

  expect(valueAfterTrigger.syncValue()).toBe("no-value");
  expect(callsCounter).toBe("");

  triggerSrc.give("done");

  expect(valueAfterTrigger.syncValue()).toBe("the-value");
  expect(callsCounter).toBe(",the-value");

  valueSrc.give("new-value");
  expect(callsCounter).toBe(",the-value");
  triggerSrc.give("done2");

  expect(valueAfterTrigger.syncValue()).toBe("new-value");

  expect(callsCounter).toBe(3);
});
