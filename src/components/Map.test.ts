import { Message } from "base/Message";
import { Of } from "base/Of";
import { Tap, TapMessage } from "base/Tap";
import { Applied } from "components/Applied";
import { Map } from "components/Map";
import { Diagram } from "testing/Diagram";
import { wait } from "testing/wait";
import { MessageType } from "types/MessageType";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

function x2(baseNumber: MessageType<number>) {
  return Message<number>((o) => {
    baseNumber.pipe(
      Tap((v) => {
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
      Message(function () {
        wait(5).then(() => {
          this.use(val);
        });
      });
    const info = Of([1, 2, 3, 9].map(infoDeferred));
    const infoMapped = Map(info, TapMessage(x2));

    const callFn = vi.fn();
    infoMapped.pipe(
      Tap((v) => {
        callFn(v.join());
      }),
    );

    await wait(50);
    expect(callFn).toBeCalled();
    expect(callFn).toBeCalledWith("2,4,6,18");
  });

  test("map twice", () => {
    const d = Diagram();
    const infoMapped = Map(Of([1, 2, 3, 9]), TapMessage(x2));

    Applied(infoMapped, String).pipe(d.tap);

    expect(d.toString()).toBe("2,4,6,18");
  });

  test("map twice values", () => {
    const d = Diagram();
    const infoMapped = Map([1, 2, 3, 9], TapMessage(x2));

    Applied(infoMapped, String).pipe(d.tap);

    expect(d.toString()).toBe("2,4,6,18");
  });
});
