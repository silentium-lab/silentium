import { expect, test, vitest } from "vitest";
import { give } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { lazy } from "../Lazy/Lazy";
import { source, value } from "./Source";
import { sourceMap } from "./SourceMap";
import { sourceSync } from "../Source/SourceSync";
import {
  destroyFromSubSource,
  patronPoolsStatistic,
} from "../Guest/PatronPool";
import { SourceType } from "../types/SourceType";
import { GuestType } from "../types/GuestType";

function x2(baseNumber: SourceType<number>) {
  return (guest: GuestType<number>) => {
    value(
      baseNumber,
      guestCast(<GuestType>guest, (v) => {
        give(v * 2, guest);
      }),
    );
    return guest;
  };
}

test("SourceMap._fn.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const src = source([1, 2, 3, 9]);
  const srcMapped = sourceMap(src, lazy(x2));
  const g = vitest.fn();
  value(srcMapped, g);
  expect(g).toBeCalledWith([2, 4, 6, 18]);

  destroyFromSubSource(src, srcMapped, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
