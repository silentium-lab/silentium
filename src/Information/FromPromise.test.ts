import { fromPromise } from "../Information/FromPromise";
import { expect, test, vi } from "vitest";
import { wait } from "../../testing/wait";
import { O } from "../Owner";

test("FromPromise.test", async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const i = fromPromise(Promise.resolve(345));
  const o = vi.fn();
  i.value(O(o));

  await wait(50);

  expect(o).toBeCalledWith(345);
});
