import { EventType, EventUserType } from "../types";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { Of } from "../base";
import { Diagram, wait } from "../testing";
import { Map } from "./Map";
import { Applied } from "./Applied";

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

  test("map twice", () => {
    const d = Diagram();
    const infoMapped = Map(Of([1, 2, 3, 9]), x2);

    Applied(infoMapped, String)(d.user);

    expect(d.toString()).toBe("2,4,6,18");
  });
});
