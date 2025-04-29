import { expect, test } from "vitest";
import { sourceOf } from "./SourceChangeable";
import { sourceSync } from "../Source/SourceSync";
import { sourceAny } from "../Source/SourceAny";

test("SourceAny.test", () => {
  const laterSrc = sourceOf<number>();
  const defaultSrc = sourceOf("default");

  const anySrc = sourceSync(sourceAny<string | number>([laterSrc, defaultSrc]));

  expect(anySrc.syncValue()).toBe("default");

  laterSrc.give(999);

  expect(anySrc.syncValue()).toBe(999);
});
