import { map } from "./Map";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { wait } from "../../testing/wait";
import { O, Owner } from "../Owner/Owner";
import { lazy } from "../utils/Lazy";
import { I, Information } from "./Information";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

function x2(baseNumber: Information<number>) {
  return I((o: Owner<number>) => {
    baseNumber.value(
      O((v) => {
        o.give(v * 2);
      }),
    );
  });
}

test("Map._deferred.test", async () => {
  const infoDeferred = (val: number) =>
    I((o) => {
      wait(5).then(() => {
        o.give(val);
      });
    });
  const info = I([1, 2, 3, 9].map(infoDeferred));
  const infoMapped = map(info, lazy(x2));
  const callFn = vi.fn();

  infoMapped.value(
    O((v) => {
      callFn(v.join());
    }),
  );

  await wait(50);
  expect(callFn).toBeCalled();
  expect(callFn).toBeCalledWith("2,4,6,18");
});
