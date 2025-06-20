import { expect, test, vitest } from "vitest";
import { patron } from "../Guest/Patron";
import { value } from "../Source/Source";
import { sourceAll } from "./SourceAll";
import { sourceOf } from "./SourceChangeable";
import { sourceSync } from "../Source/SourceSync";
import {
  destroyFromSubSource,
  patronPoolsStatistic,
} from "../Guest/PatronPool";

test("SourceAll._withPatron.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const one = sourceOf<number>(1);
  const two = sourceOf<number>(2);
  const all = sourceAll([one.value, two.value]);

  one.give(3);
  one.give(4);

  const g = vitest.fn();
  value(
    all,
    patron((value) => {
      g(Object.values(value).length);
    }),
  );

  expect(g).toBeCalledWith(2);

  destroyFromSubSource(one, two, all, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
