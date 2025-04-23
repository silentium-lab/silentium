import { expect, test } from "vitest";
import { give, GuestType } from "../Guest/Guest";
import { SourceObjectType, SourceType, value } from "./Source";
import { sourceMap } from "./SourceMap";
import { GuestCast } from "../Guest/GuestCast";
import { sourceChangeable } from "./SourceChangeable";
import { PrivateClass } from "../Personal/PrivateClass";
import { GuestSync } from "../Guest/GuestSync";

class X2 implements SourceObjectType<number> {
  public constructor(private baseNumber: SourceType<number>) {}

  public value(guest: GuestType<number>) {
    value(
      this.baseNumber,
      new GuestCast(<GuestType>guest, (v) => {
        give(v * 2, guest);
      }),
    );
    return this;
  }
}

test("SourceMap.test", () => {
  const source = sourceChangeable([1, 2, 3, 9]);
  const guestMapped = sourceMap(source, new PrivateClass(X2));
  const guest = new GuestSync([]);

  value(guestMapped, guest);

  expect(guest.value().join()).toBe("2,4,6,18");
});
