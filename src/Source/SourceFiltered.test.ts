import { G } from "../Guest";
import { expect, test, vitest } from "vitest";
import { S } from "../Source/Source";
import { filtered } from "../Source/SourceFiltered";

test("SourceFiltered.test", () => {
  const source = filtered(S(11), (v) => v === 11);

  const g1 = vitest.fn();
  source.value(G(g1));
  expect(g1).toBeCalledWith(11);

  const source2 = filtered(S<number>(11), (v) => v === 22);

  const g2 = vitest.fn();
  source2.value(G(g2));
  expect(g2).not.toHaveBeenCalled();
});
