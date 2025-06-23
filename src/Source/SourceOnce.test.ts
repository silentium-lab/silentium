import { of } from "../Source/Of";
import { expect, test, vitest } from "vitest";
import { once } from "./SourceOnce";
import { G } from "../Guest";

test("SourceOnce.test", () => {
  const [ofs, ofg] = of<number>(123);
  const source = once(ofs);
  const g = vitest.fn();
  source.value(G(g));

  ofg.give(321);

  expect(g).toBeCalledWith(123);
});
