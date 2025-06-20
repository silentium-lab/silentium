import { expect, test } from "vitest";
import { give } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { guestSync } from "../Guest/GuestSync";
import { lazyClass } from "../utils/LazyClass";
import { destroy, patronPoolsStatistic, subSource } from "../Guest/PatronPool";
import { sourceOf } from "../Source/SourceChangeable";
import { sourceSync } from "../Source/SourceSync";
import { value } from "./Source";
import { sourceMap } from "./SourceMap";
import { SourceObjectType, SourceType } from "../types/SourceType";
import { GuestType } from "../types/GuestType";

class X2 implements SourceObjectType<number> {
  public constructor(private baseNumber: SourceType<number>) {
    subSource(this, baseNumber);
  }

  public value(guest: GuestType<number>) {
    value(
      this.baseNumber,
      guestCast(<GuestType>guest, (v) => {
        give(v * 2, guest);
      }),
    );
    return this;
  }
}

test("SourceMap._destroy.test", () => {
  const statistic = sourceSync(patronPoolsStatistic);
  const sources = [sourceOf(1), sourceOf(2), sourceOf(3), sourceOf(9)];
  const srcMapped = sourceMap(sources, lazyClass(X2));
  const guest = guestSync([]);

  value(srcMapped, guest);

  expect(guest.value().join()).toBe("2,4,6,18");

  destroy(srcMapped);
  destroy(...sources);

  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
