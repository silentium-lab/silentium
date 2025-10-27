import { EventType, TransportType } from "../types";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { Event, Of, Transport, TransportEvent } from "../base";
import { Diagram, wait } from "../testing";
import { Map } from "./Map";
import { Applied } from "./Applied";

function x2(baseNumber: EventType<number>) {
  return Event<number>((o) => {
    baseNumber.event(
      Transport((v) => {
        o.use(v * 2);
      }),
    );
  });
}

describe("Map.test", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  test("map async", async () => {
    const infoDeferred = (val: number) =>
      Event((o: TransportType<number>) => {
        wait(5).then(() => {
          o.use(val);
        });
      });
    const info = Of([1, 2, 3, 9].map(infoDeferred));
    const infoMapped = Map(info, TransportEvent(x2));

    const callFn = vi.fn();
    infoMapped.event(
      Transport((v) => {
        callFn(v.join());
      }),
    );

    await wait(50);
    expect(callFn).toBeCalled();
    expect(callFn).toBeCalledWith("2,4,6,18");
  });

  test("map twice", () => {
    const d = Diagram();
    const infoMapped = Map(Of([1, 2, 3, 9]), TransportEvent(x2));

    Applied(infoMapped, String).event(d.transport);

    expect(d.toString()).toBe("2,4,6,18");
  });
});
