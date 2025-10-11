import { describe, expect, test, vi } from "vitest";
import { wait } from "../testing";
import { fromPromise } from "./FromPromise";
import { late } from "./Late";

describe("FromPromise.test", () => {
  test("event from promise", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const i = fromPromise(Promise.resolve(345));
    const o = vi.fn();
    i(o);

    await wait(50);

    expect(o).toBeCalledWith(345);

    const err = late();
    const i2 = fromPromise(Promise.reject(111), err.use);
    const o2 = vi.fn();
    i2(o2);

    const oError = vi.fn();
    err.event(oError);

    await wait(50);

    expect(o2).not.toHaveBeenCalled();
    expect(oError).toBeCalledWith(111);
  });
});
