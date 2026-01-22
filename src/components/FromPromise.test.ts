import { describe, expect, test, vi } from "vitest";
import { wait } from "testing/wait";
import { Destructured } from "components/Destructured";
import { All } from "components/All";
import { Catch } from "components/Catch";

function sum(a: number, b: number) {
  return a + b;
}

describe("FromPromise.test", () => {
  test("message from promise", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const i = Destructured(All(Promise.resolve(3), Promise.resolve(5)), sum);
    const o = vi.fn();
    i.then(o);

    await wait(50);

    expect(o).toBeCalledWith(8);

    const o2 = vi.fn();
    const $err = Catch(Promise.reject(111));
    $err.then(o2);

    await wait(50);

    expect(o2).toBeCalledWith(111);
  });
});
