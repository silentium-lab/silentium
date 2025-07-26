import { wait } from "../testing";
import { InformationType, OwnerType } from "../types";
import { i } from "./Information";
import { map } from "./Map";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

function x2(baseNumber: InformationType<number>) {
  return (o: OwnerType<number>) => {
    baseNumber((v) => {
      o(v * 2);
    });
  };
}

test("Map._deferred.test", async () => {
  const infoDeferred = (val: number) => (o: OwnerType<number>) => {
    wait(5).then(() => {
      o(val);
    });
  };
  const info = i([1, 2, 3, 9].map(infoDeferred));
  const infoMapped = map(info, x2);
  const callFn = vi.fn();

  infoMapped((v) => {
    callFn(v.join());
  });

  await wait(50);
  expect(callFn).toBeCalled();
  expect(callFn).toBeCalledWith("2,4,6,18");
});
