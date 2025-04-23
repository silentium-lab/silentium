import { expect, test } from "vitest";
import { give, GuestType } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { GuestSync } from "../Guest/GuestSync";
import { personalClass } from "../Personal/PersonalClass";
import { SourceObjectType, SourceType, value } from "./Source";
import { sourceMap } from "./SourceMap";

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
  const guestMapped = sourceMap([1, 2, 3, 9], personalClass(X2));
  const guest = new GuestSync([]);

  value(guestMapped, guest);

  expect(guest.value().join()).toBe("2,4,6,18");
});
