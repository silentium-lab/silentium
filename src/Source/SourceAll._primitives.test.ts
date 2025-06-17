import { sourceSync } from "../Source/SourceSync";
import { value } from "../Source/Source";
import { sourceAll } from "../Source/SourceAll";
import { expect, test, vi } from "vitest";
import { destroy, patronPoolsStatistic } from "../Patron/PatronPool";

test("SourceAll._primitives.test", () => {
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
