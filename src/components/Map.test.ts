import { EventType, EventUserType } from "../types";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { of } from "../base";
import { diagram, wait } from "../testing";
import { map } from "./Map";
import { applied } from "./Applied";

function x2(baseNumber: EventType<number>) {
  return (o: EventUserType<number>) => {
    baseNumber((v) => {
      o(v * 2);
    });
  };
}

describe("Map.test", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  test("Map._deferred.test", async () => {
    const infoDeferred = (val: number) => (o: EventUserType<number>) => {
      wait(5).then(() => {
        o(val);
      });
    };
    const info = of([1, 2, 3, 9].map(infoDeferred));
    const infoMapped = map(info, x2);

    const callFn = vi.fn();
    infoMapped((v) => {
      callFn(v.join());
    });

    await wait(50);
    expect(callFn).toBeCalled();
    expect(callFn).toBeCalledWith("2,4,6,18");
  });

  test("map twice", () => {
    const d = diagram();
    const infoMapped = map(of([1, 2, 3, 9]), x2);

    applied(infoMapped, String)(d.user);

    expect(d.toString()).toBe("2,4,6,18");
  });
});
