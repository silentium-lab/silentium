import { expect, test, vi } from "vitest";
import { any } from "./Any";
import { i } from "./Information";
import { of } from "./Of";

test("Any.test", () => {
  const [laterI, laterO] = of<number>();
  const defaultI = i("default");

  const anyI = any<any>(laterI, defaultI);

  const o = vi.fn();
  anyI(o);

  expect(o).toHaveBeenCalledWith("default");

  laterO(999);

  expect(o).toBeCalledWith(999);
});
