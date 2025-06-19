import { expect, test, vitest } from "vitest";
import { source, value } from "./Source";
import { sourceSync } from "../Source/SourceSync";
import { destroy, patronPoolsStatistic } from "../Patron/PatronPool";

test("Source.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const aware = source(111);

  const guest = vitest.fn();
  value(aware, guest);

  expect(guest).toBeCalledWith(111);

  destroy(aware);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
