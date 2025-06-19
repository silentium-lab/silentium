import { expect, test } from "vitest";
import { sourceOf } from "./SourceChangeable";
import { sourceSync } from "../Source/SourceSync";
import { sourceAny } from "../Source/SourceAny";
import {
  destroyFromSubSource,
  patronPoolsStatistic,
} from "../Patron/PatronPool";

test("SourceAny.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const laterSrc = sourceOf<number>();
  const defaultSrc = sourceOf("default");

  const anySrc = sourceSync(sourceAny<string | number>([laterSrc, defaultSrc]));

  expect(anySrc.syncValue()).toBe("default");

  laterSrc.give(999);

  expect(anySrc.syncValue()).toBe(999);

  destroyFromSubSource(anySrc, laterSrc, defaultSrc, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
