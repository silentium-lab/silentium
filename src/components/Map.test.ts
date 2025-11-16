import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { Map } from "components/Map";
import { Applied } from "components/Applied";
import { MessageType } from "types/MessageType";
import { TransportType } from "types/TransportType";
import { wait } from "testing/wait";
import { Diagram } from "testing/Diagram";
import { Message } from "base/Message";
import { Transport, TransportMessage } from "base/Transport";
import { Of } from "base/Of";

function x2(baseNumber: MessageType<number>) {
  return Message<number>((o) => {
    baseNumber.to(
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
      Message((o: TransportType<number>) => {
        wait(5).then(() => {
          o.use(val);
        });
      });
    const info = Of([1, 2, 3, 9].map(infoDeferred));
    const infoMapped = Map(info, TransportMessage(x2));

    const callFn = vi.fn();
    infoMapped.to(
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
    const infoMapped = Map(Of([1, 2, 3, 9]), TransportMessage(x2));

    Applied(infoMapped, String).to(d.transport);

    expect(d.toString()).toBe("2,4,6,18");
  });

  test("map twice values", () => {
    const d = Diagram();
    const infoMapped = Map([1, 2, 3, 9], TransportMessage(x2));

    Applied(infoMapped, String).to(d.transport);

    expect(d.toString()).toBe("2,4,6,18");
  });
});
