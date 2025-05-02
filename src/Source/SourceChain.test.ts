import { sourceChain } from "../Source/SourceChain";
import { expect, test } from "vitest";
import { sourceSync } from "../Source/SourceSync";
import { sourceOf } from "./SourceChangeable";

test("SourceChain.test", () => {
  const triggerSrc = sourceOf();
  const valueSrc = sourceOf<string>("the-value");

  const valueAfterTrigger = sourceSync(
    sourceChain(triggerSrc, valueSrc),
    "no-value",
  );

  expect(valueAfterTrigger.syncValue()).toBe("no-value");

  triggerSrc.give("done");

  expect(valueAfterTrigger.syncValue()).toBe("the-value");
});
