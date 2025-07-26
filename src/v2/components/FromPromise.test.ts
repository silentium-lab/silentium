import { expect, test, vi } from "vitest";
import { fromPromise } from "./FromPromise";
import { wait } from "../testing";

test("FromPromise.test", async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const [i] = fromPromise(Promise.resolve(345));
  const o = vi.fn();
  i(o);

  await wait(50);

  expect(o).toBeCalledWith(345);

  const [i2, errorInf] = fromPromise(Promise.reject(111));
  const o2 = vi.fn();
  i2(o2);

  const oError = vi.fn();
  errorInf(oError);

  await wait(50);

  expect(o2).not.toHaveBeenCalled();
  expect(oError).toBeCalledWith(111);
});
