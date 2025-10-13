import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { wait } from "../testing";
import { DataType, DataUserType } from "../types";
import { Of } from "../base";
import { Map } from "../components/Map";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

function x2(baseNumber: DataType<number>) {
  return (o: DataUserType<number>) => {
    baseNumber((v) => {
      o(v * 2);
    });
  };
}

test("Map._deferred.test", async () => {
  const infoDeferred = (val: number) => (o: DataUserType<number>) => {
    wait(5).then(() => {
      o(val);
    });
  };
  const info = Of([1, 2, 3, 9].map(infoDeferred));
  const infoMapped = Map(info, x2);

  const callFn = vi.fn();
  infoMapped((v) => {
    callFn(v.join());
  });

  await wait(50);
  expect(callFn).toBeCalled();
  expect(callFn).toBeCalledWith("2,4,6,18");
});
