import { expect, test, vitest } from "vitest";
import { give, GuestType } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { personal } from "../Personal/Personal";
import { source, SourceType, value } from "./Source";
import { sourceMap } from "./SourceMap";

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
  const src = source([1, 2, 3, 9]);
  const srcMapped = sourceMap(src, personal(x2));
  const g = vitest.fn();
  value(srcMapped, g);
  expect(g).toBeCalledWith([2, 4, 6, 18]);
});
