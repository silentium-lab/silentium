import { expect, test, vitest } from "vitest";
import { give } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { lazyClass } from "../Lazy/LazyClass";
import { source, value } from "./Source";
import { sourceSequence } from "./SourceSequence";
import { sourceSync } from "../Source/SourceSync";
import {
  destroyFromSubSource,
  patronPoolsStatistic,
} from "../Guest/PatronPool";
import { SourceObjectType, SourceType } from "../types/SourceType";
import { GuestType } from "../types/GuestType";

class X2 implements SourceObjectType<number> {
  public constructor(private baseNumber: SourceType<number>) {}

  public value(guest: GuestType<number>) {
    value(
      this.baseNumber,
      guestCast(guest, (v) => {
        give(v * 2, guest);
      }),
    );
    return this;
  }
}

test("SourceSequence.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const src = source([1, 2, 3, 9]);
  const srcMapped = sourceSequence(src, lazyClass(X2));
  const g = vitest.fn();
  value(srcMapped, g);
  expect(g).toBeCalledWith([2, 4, 6, 18]);

  destroyFromSubSource(src, srcMapped, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
