import { expect, test } from "vitest";
import { sourceOf } from "./SourceChangeable";
import { sourceCombined } from "../Source/SourceCombined";
import { give, GuestType } from "../Guest/Guest";
import { sourceSync } from "../Source/SourceSync";
import {
  destroyFromSubSource,
  patronPoolsStatistic,
} from "../Patron/PatronPool";

test("SourceCombined.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const numSrc = sourceOf<number>(42);
  const stringSrc = sourceOf<string>("greet");

  const combinedSrc = sourceSync(
    sourceCombined(
      numSrc,
      stringSrc,
    )((g: GuestType<string>, num, str) => {
      give(String(str) + String(num), g);
    }),
  );

  expect(combinedSrc.syncValue()).toBe("greet42");

  destroyFromSubSource(numSrc, stringSrc, combinedSrc, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
