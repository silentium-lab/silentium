import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { wait } from "../../test-utils/wait";
import { give, GuestType } from "../Guest/Guest";
import { GuestCast } from "../Guest/GuestCast";
import { Patron } from "../Patron/Patron";
import { personal } from "../Personal/Personal";
import { source, SourceType, value } from "./Source";
import { sourceChangeable } from "./SourceChangeable";
import { sourceMap } from "./SourceMap";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

function x2(baseNumber: SourceType<number>) {
  return (guest: GuestType<number>) => {
    value(
      baseNumber,
      new GuestCast(guest, (v) => {
        give(v * 2, guest);
      }),
    );
    return guest;
  };
}

test("SourceMap._deferred.test", async () => {
  const sourceOf = (val: number) =>
    source(async (guest) => {
      await wait(5);
      give(val, guest);
    });
  const src = sourceChangeable([1, 2, 3, 9].map(sourceOf));
  const srcMapped = sourceMap(src, personal(x2));
  const callFn = vi.fn();
  value(
    srcMapped,
    new Patron((v) => {
      callFn(v.join());
    }),
  );
  await wait(50);
  expect(callFn).toBeCalled();
  expect(callFn).toBeCalledWith("2,4,6,18");
});
