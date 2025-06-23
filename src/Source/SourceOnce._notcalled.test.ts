import { G } from "../Guest";
import { of } from "../Source/Of";
import { expect, test, vitest } from "vitest";
import { once } from "./SourceOnce";

test("SourceOnce._notcalled.test", () => {
  const [ofs, ofg] = of<number>();
  const source = once(ofs);
  const g = vitest.fn();
  source.value(G(g));

  expect(g).not.toHaveBeenCalled();
  ofg.give(111);
  expect(g).toBeCalledWith(111);
});
