import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { wait } from "../../test-utils/wait";
import { give, GuestType } from "../Guest/Guest";
import { GuestCast } from "../Guest/GuestCast";
import { Patron } from "../Patron/Patron";
import { personalClass } from "../Personal/PersonalClass";
import { source, SourceObjectType, SourceType, value } from "./Source";
import { sourceChangeable } from "./SourceChangeable";
import { sourceSequence } from "./SourceSequence";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

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

test("SourceSequence._deferred.test", async () => {
  const sourceOf = (val: number) =>
    source((guest) => {
      setTimeout(() => {
        give(val, guest);
      }, 10);
    });
  const src = sourceChangeable([1, 2, 3, 9].map(sourceOf));

  const sequence = sourceSequence(src, personalClass(X2));

  const callFn = vi.fn();
  value(
    sequence,
    new Patron((v) => {
      callFn(v.join());
    }),
  );

  await wait(51);
  expect(callFn).toBeCalled();
  expect(callFn).toBeCalledWith("2,4,6,18");
});
