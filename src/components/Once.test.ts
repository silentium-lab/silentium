import { of } from "./Of";
import { expect, test, vitest } from "vitest";
import { once } from "./Once";

test("Once.test", () => {
  const [ofs, ofg] = of<number>(123);
  const info = once(ofs);
  const g = vitest.fn();
  info(g);

  ofg(321);

  expect(g).toBeCalledWith(123);
});
