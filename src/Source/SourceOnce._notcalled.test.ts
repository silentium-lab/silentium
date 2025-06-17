import { expect, test, vi, vitest } from "vitest";
import { sourceOnce } from "./SourceOnce";
import { sourceSync } from "../Source/SourceSync";
import { patronPoolsStatistic } from "../Patron/PatronPool";

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
});
