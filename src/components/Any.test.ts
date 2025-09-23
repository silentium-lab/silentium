import { expect, test, vi } from "vitest";
import { Any } from "./Any";
import { Late } from "./Late";
import { Destroyable, From, Of } from "../base";

test("Any.test", () => {
  const l = new Late<number>();
  const d = new Of("default");

  const anyI = new Any<any>(l, d);

  const o = vi.fn();
  anyI.value(new From(o));

  expect(o).toHaveBeenCalledWith("default");

  l.give(999);

  expect(o).toBeCalledWith(999);
  anyI.destroy();
  const destroyable = Destroyable;
  expect(destroyable.getInstancesCount()).toBe(0);
});
