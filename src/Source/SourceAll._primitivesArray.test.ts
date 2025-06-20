import { sourceSync } from "../Source/SourceSync";
import { value } from "./Source";
import { sourceAll } from "./SourceAll";
import { expect, test, vi } from "vitest";
import { destroy, patronPoolsStatistic } from "../Guest/PatronPool";

test("SourceAll._primitivesArray.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const one = 1;
  const two = 2;
  const all = sourceAll([one, two]);

  const g = vi.fn();
  value(all, g);

  expect(g).toBeCalledWith([1, 2]);

  destroy(all, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
