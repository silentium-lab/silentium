import { describe, expect, test, vi } from "vitest";
import { FromPromise } from "components/FromPromise";
import { Late } from "components/Late";
import { Transport } from "base/Transport";
import { wait } from "testing/wait";

describe("FromPromise.test", () => {
  test("event from promise", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const i = FromPromise(Promise.resolve(345));
    const o = vi.fn();
    i.event(Transport(o));

    await wait(50);

    expect(o).toBeCalledWith(345);

    const err = Late();
    const i2 = FromPromise(Promise.reject(111), err);
    const o2 = vi.fn();
    i2.event(Transport(o2));

    const oError = vi.fn();
    err.event(Transport(oError));

    await wait(50);

    expect(o2).not.toHaveBeenCalled();
    expect(oError).toBeCalledWith(111);
  });
});
