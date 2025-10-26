import { EventType, EventUserType } from "../types";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { Event, Of, User } from "../base";
import { Diagram, wait } from "../testing";
import { Map } from "./Map";
import { Applied } from "./Applied";
import { Transport } from "../components/Transport";

function x2(baseNumber: EventType<number>) {
  return new Event<number>((o) => {
    baseNumber.event(
      new User((v) => {
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
      new Event((o: EventUserType<number>) => {
        wait(5).then(() => {
          o.use(val);
        });
      });
    const info = new Of([1, 2, 3, 9].map(infoDeferred));
    const infoMapped = new Map(info, new Transport(x2));

    const callFn = vi.fn();
    infoMapped.event(
      new User((v) => {
        callFn(v.join());
      }),
    );

    await wait(50);
    expect(callFn).toBeCalled();
    expect(callFn).toBeCalledWith("2,4,6,18");
  });

  test("map twice", () => {
    const d = Diagram();
    const infoMapped = new Map(new Of([1, 2, 3, 9]), new Transport(x2));

    new Applied(infoMapped, String).event(d.user);

    expect(d.toString()).toBe("2,4,6,18");
  });
});
