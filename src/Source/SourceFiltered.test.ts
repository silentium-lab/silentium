import { SourceFiltered } from "../Source/SourceFiltered";
import { expect, test, vitest } from "vitest";

test("SourceFiltered.test", () => {
  const source = new SourceFiltered(11, (v) => v === 11);

  const g1 = vitest.fn();
  source.value(g1);
  expect(g1).toBeCalledWith(11);

  const source2 = new SourceFiltered(11, (v) => v === 22);

  const g2 = vitest.fn();
  source2.value(g2);
  expect(g2).not.toHaveBeenCalled();
});
