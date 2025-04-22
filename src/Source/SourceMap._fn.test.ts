import { expect, test, vitest } from "vitest";
import { give, GuestType } from "../Guest/Guest";
import { GuestCast } from "../Guest/GuestCast";
import { Private } from "../Private/Private";
import { SourceType, value } from "./Source";
import { sourceChangeable } from "./SourceChangeable";
import { sourceMap } from "./SourceMap";

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
  const source = sourceChangeable([1, 2, 3, 9]);
  const guestMapped = sourceMap(source, new Private(x2));
  const g = vitest.fn();
  value(guestMapped, g);
  expect(g).toBeCalledWith([2, 4, 6, 18]);
});
