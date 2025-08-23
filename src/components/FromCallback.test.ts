import { expect, test, vi } from "vitest";
import { FromCallback } from "./FromCallback";
import { From } from "../base";

test("FromCallback.test", () => {
  const i = new FromCallback((cb, v) => cb(v), 123);

  const o = vi.fn();
  i.value(new From(o));

  expect(o).toBeCalledWith(123);
});
