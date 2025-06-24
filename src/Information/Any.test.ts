import { of } from "./Of";
import { I } from "./Information";
import { expect, test, vi } from "vitest";
import { any } from "./Any";
import { O } from "../Owner";

test("Any.test", () => {
  const [laterI, laterG] = of<number>();
  const defaultI = I("default");

  const anyI = any<any>(laterI, defaultI);

  const g = vi.fn();
  anyI.value(O(g));

  expect(g).toHaveBeenCalledWith("default");

  laterG.give(999);

  expect(g).toBeCalledWith(999);
});
