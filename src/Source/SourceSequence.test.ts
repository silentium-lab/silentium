import { expect, test, vitest } from "vitest";
import { give, GuestType } from "../Guest/Guest";
import { GuestCast } from "../Guest/GuestCast";
import { personalClass } from "../Personal/PersonalClass";
import { SourceObjectType, SourceType, value } from "./Source";
import { sourceChangeable } from "./SourceChangeable";
import { sourceSequence } from "./SourceSequence";

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

test("SourceSequence.test", () => {
  const source = sourceChangeable([1, 2, 3, 9]);
  const srcMapped = sourceSequence(source, personalClass(X2));
  const g = vitest.fn();
  value(srcMapped, g);
  expect(g).toBeCalledWith([2, 4, 6, 18]);
});
