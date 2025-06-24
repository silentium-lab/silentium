import { of } from "./Of";
import { expect, test, vitest } from "vitest";
import { once } from "./Once";
import { O } from "../Owner";

test("Once.test", () => {
  const [ofs, ofg] = of<number>(123);
  const info = once(ofs);
  const g = vitest.fn();
  info.value(O(g));

  ofg.give(321);

  expect(g).toBeCalledWith(123);
});
