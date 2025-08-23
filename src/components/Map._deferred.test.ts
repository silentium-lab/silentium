import { From, Lazy, Of, OfFunc, TheInformation, TheOwner } from "../base";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { wait } from "../testing";
import { Map } from "./Map";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

function x2(baseNumber: TheInformation<number>) {
  return new OfFunc((o: TheOwner<number>) => {
    baseNumber.value(
      new From((v) => {
        o.give(v * 2);
      }),
    );
  });
}

test("Map._deferred.test", async () => {
  const infoDeferred = (val: number) =>
    new OfFunc((o: TheOwner<number>) => {
      wait(5).then(() => {
        o.give(val);
      });
    });
  const info = new Of([1, 2, 3, 9].map(infoDeferred));
  const infoMapped = new Map(info, new Lazy(x2));

  const callFn = vi.fn();
  infoMapped.value(
    new From((v) => {
      callFn(v.join());
    }),
  );

  await wait(50);
  expect(callFn).toBeCalled();
  expect(callFn).toBeCalledWith("2,4,6,18");
});
