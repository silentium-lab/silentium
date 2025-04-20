import { Private } from "../Private/Private";
import { expect, test, vitest } from "vitest";
import { SourceChangeable } from "./SourceChangeable";
import { give, GuestType } from "../Guest/Guest";
import { SourceType, value } from "./Source";
import { SourceMap } from "./SourceMap";
import { GuestCast } from "../Guest/GuestCast";

function x2(baseNumber: SourceType<number>) {
  return (guest: GuestType<number>) => {
    value(
      baseNumber,
      new GuestCast(<GuestType>guest, (v) => {
        give(v * 2, guest);
      }),
    );
    return guest;
  };
}

test("SourceMap._fn.test", () => {
  const source = new SourceChangeable([1, 2, 3, 9]);
  const guestMapped = new SourceMap(source, new Private(x2));
  const g = vitest.fn();
  guestMapped.value(g);
  expect(g).toBeCalledWith([2, 4, 6, 18]);
});
