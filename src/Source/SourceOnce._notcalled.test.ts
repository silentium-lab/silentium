import { expect, test, vi, vitest } from "vitest";
import { sourceOnce } from "./SourceOnce";
import { sourceSync } from "../Source/SourceSync";
import {
  destroyFromSubSource,
  patronPoolsStatistic,
} from "../Patron/PatronPool";

test("SourceOnce._notcalled.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const source = sourceOnce();
  const guestNotCalled = vi.fn();
  source.value(guestNotCalled);
  expect(guestNotCalled).not.toHaveBeenCalled();
  source.give(111);
  const g = vitest.fn();
  source.value(g);
  expect(g).toBeCalledWith(111);

  destroyFromSubSource(source, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
