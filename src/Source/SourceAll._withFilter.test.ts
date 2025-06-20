import { expect, test } from "vitest";
import {
  destroyFromSubSource,
  patronPoolsStatistic,
} from "../Guest/PatronPool";
import { sourceApplied } from "../Source/SourceApplied";
import { sourceFiltered } from "../Source/SourceFiltered";
import { sourceSync } from "../Source/SourceSync";
import { sourceAll } from "./SourceAll";

const vowels = ["a", "e", "i", "u", "o", "y"];
const beginsWithVowel = (str: string) => vowels.includes(str[0]);

test("SourceAll._withFilter.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const chunks = sourceSync(
    sourceApplied(
      sourceAll([
        sourceFiltered("hello", beginsWithVowel, ""),
        sourceFiltered("yeld", beginsWithVowel, ""),
        sourceFiltered("buy", beginsWithVowel, ""),
        sourceFiltered("array", beginsWithVowel, ""),
        sourceFiltered("integer", beginsWithVowel, ""),
      ]),
      (v) => v.filter(Boolean).join(", "),
    ),
  );

  expect(chunks.syncValue()).toBe("yeld, array, integer");

  destroyFromSubSource(chunks, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
