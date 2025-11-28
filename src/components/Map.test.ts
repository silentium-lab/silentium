import { Message } from "base/Message";
import { Of } from "base/Of";
import { Applied } from "components/Applied";
import { LateShared } from "components/LateShared";
import { Map } from "components/Map";
import { Diagram } from "testing/Diagram";
import { wait } from "testing/wait";
import { MessageType } from "types/MessageType";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

function x2(baseNumber: MessageType<number>) {
  return Message<number>((o) => {
    baseNumber.then((v) => {
      o(v * 2);
    });
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
      Message(function (r) {
        wait(5).then(() => {
          r(val);
        });
      });
    const info = Of([1, 2, 3, 9].map(infoDeferred));
    const infoMapped = Map(info, x2);

    const callFn = vi.fn();
    infoMapped.then((v) => {
      callFn(v.join());
    });

    await wait(50);
    expect(callFn).toBeCalled();
    expect(callFn).toBeCalledWith("2,4,6,18");
  });

  test("map twice", () => {
    const d = Diagram();
    const infoMapped = Map(Of([1, 2, 3, 9]), x2);

    Applied(infoMapped, String).then(d.resolver);

    expect(d.toString()).toBe("2,4,6,18");
  });

  test("map twice values", () => {
    const d = Diagram();
    const infoMapped = Map([1, 2, 3, 9], x2);

    Applied(infoMapped, String).then(d.resolver);

    expect(d.toString()).toBe("2,4,6,18");
  });

  test("map preserves array length", () => {
    const d = Diagram();
    const input = LateShared([1, 2, 3, 4, 5]);
    const infoMapped = Map(input, x2);

    Applied(infoMapped, (arr) => arr.length).then(d.resolver);
    expect(d.toString()).toBe("5");

    input.use([6, 7, 9]);
    expect(d.toString()).toBe("5|3");
  });
});
