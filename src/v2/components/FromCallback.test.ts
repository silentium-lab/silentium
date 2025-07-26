import { expect, test, vi } from "vitest";
import { fromCallback } from "./FromCallback";

test("FromCallback.test", () => {
  const i = fromCallback((cb, v) => cb(v), 123);

  const o = vi.fn();
  i(o);

  expect(o).toBeCalledWith(123);
});
