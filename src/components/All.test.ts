import { expect, test, vi } from "vitest";
import { All } from "./All";
import { Destroyable, From, Of } from "../base";

test("All.test", () => {
  const a = new All(new Of(1), new Of(2));

  const o = vi.fn();
  a.value(new From(o));

  expect(o).toBeCalledWith([1, 2]);
  a.destroy();
  expect(Destroyable.getInstancesCount()).toBe(0);
});
