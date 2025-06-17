import { expect, test, vitest } from "vitest";
import { value } from "./Source";
import { sourceFiltered } from "./SourceFiltered";
import { sourceSync } from "../Source/SourceSync";
import { patronPoolsStatistic } from "../Patron/PatronPool";

test("SourceFiltered.defaultValue.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const source = sourceFiltered(11, (v) => v === 11);

  const g1 = vitest.fn();
  value(source, g1);
  expect(g1).toBeCalledWith(11);

  const source2 = sourceFiltered(<number>11, (v) => v === 22, 33);

  const g2 = vitest.fn();
  value(source2, g2);
  expect(g2).toBeCalledWith(33);
});
