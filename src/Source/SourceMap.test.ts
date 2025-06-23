import { expect, test } from "vitest";
import { diagram } from "../../test-utils/diagram";
import { give } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { GuestType } from "../types/GuestType";
import { SourceObjectType, SourceType } from "../types/SourceType";
import { lazyClass } from "../utils/LazyClass";
import { S, value } from "./Source";
import { map } from "./SourceMap";

class X2 implements SourceObjectType<number> {
  public constructor(private baseNumber: SourceType<number>) {}

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

test("SourceMap.test", () => {
  const [d, dG] = diagram();
  const srcMapped = map(S([1, 2, 3, 9]), lazyClass(X2));

  srcMapped.value(dG);

  expect(d()).toBe("2,4,6,18");
});
