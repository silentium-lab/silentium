import { expect, test, vitest } from "vitest";
import { patron } from "../Guest/Patron";
import { sourceOf } from "./SourceChangeable";
import { sourceSync } from "../Source/SourceSync";
import {
  destroyFromSubSource,
  patronPoolsStatistic,
} from "../Guest/PatronPool";

test("SourceChangeable._empty.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const source = sourceOf();
  const guest = vitest.fn();

  source.value(patron(guest));
  source.give(42);

  expect(guest).toBeCalled();
  expect(guest).toBeCalledWith(42);

  destroyFromSubSource(source, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
