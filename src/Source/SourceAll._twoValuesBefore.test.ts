import { value } from "../Source/Source";
import { expect, test, vitest } from "vitest";
import { sourceAll } from "./SourceAll";
import { sourceOf } from "./SourceChangeable";
import { sourceSync } from "../Source/SourceSync";
import { destroy, patronPoolsStatistic } from "../Guest/PatronPool";

test("SourceAll._twoValuesBefore.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const one = sourceOf(1);
  const two = sourceOf(2);
  const all = sourceAll([one.value, two.value]);

  const g = vitest.fn();
  value(all, (value) => {
    g(Object.values(value).join());
  });

  expect(g).toBeCalledWith("1,2");

  destroy(one, two, all, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
