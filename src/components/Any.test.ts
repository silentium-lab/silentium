import { expect, test, vi } from "vitest";
import { of } from "../base/Of";
import { any } from "./Any";
import { late } from "./Late";

test("Any.test", () => {
  const l = late<number>();
  const d = of("default");

  const anyI = any<string | number>(l.value, d);

  const o = vi.fn();
  anyI(o);

  expect(o).toHaveBeenCalledWith("default");

  l.give(999);

  expect(o).toBeCalledWith(999);
});
