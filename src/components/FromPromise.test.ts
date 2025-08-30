import { expect, test, vi } from "vitest";
import { FromPromise } from "./FromPromise";
import { wait } from "../testing";
import { From } from "../base";
import { Late } from "./Late";

test("FromPromise.test", async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const i = new FromPromise(Promise.resolve(345));
  const o = vi.fn();
  i.value(new From(o));

  await wait(50);

  expect(o).toBeCalledWith(345);

  const err = new Late();
  const i2 = new FromPromise(Promise.reject(111), err);
  const o2 = vi.fn();
  i2.value(new From(o2));

  const oError = vi.fn();
  err.value(new From(oError));

  await wait(50);

  expect(o2).not.toHaveBeenCalled();
  expect(oError).toBeCalledWith(111);
});
