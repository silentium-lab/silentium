import { expect, test, vitest } from "vitest";
import { give, guest } from "../Guest/Guest";
import { sourceDynamic } from "./SourceDynamic";
import { sourceSync } from "../Source/SourceSync";
import {
  destroyFromSubSource,
  patronPoolsStatistic,
} from "../Guest/PatronPool";

test("SourceDynamic", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  let theValue = 1;
  const sd = sourceDynamic(
    guest((value: number) => {
      theValue = value;
    }),
    (g) => give(theValue, g),
  );

  const g1 = vitest.fn();
  sd.value(g1);
  expect(g1).toBeCalledWith(1);

  sd.give(2);

  const g2 = vitest.fn();
  sd.value(g2);
  expect(g2).toBeCalledWith(2);

  destroyFromSubSource(sd, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
