import { fromCallback } from "../Information/FromCallback";
import { expect, test, vi } from "vitest";
import { O } from "../Owner";

test("FromCallback.test", () => {
  const i = fromCallback((cb) => cb(123));

  const o = vi.fn();
  i.value(O(o));

  expect(o).toBeCalledWith(123);
});
