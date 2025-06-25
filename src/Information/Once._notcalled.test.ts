import { O } from "../Owner";
import { of } from "./Of";
import { expect, test, vitest } from "vitest";
import { once } from "./Once";

test("Once._notcalled.test", () => {
  const [ofs, ofg] = of<number>();
  const info = once(ofs);
  const g = vitest.fn();
  info.value(O(g));

  expect(g).not.toHaveBeenCalled();
  ofg.give(111);
  expect(g).toBeCalledWith(111);
});
