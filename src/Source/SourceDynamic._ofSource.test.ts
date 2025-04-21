import { SourceDynamic } from "./SourceDynamic";
import { sourceChangeable } from "./SourceChangeable";
import { expect, test, vitest } from "vitest";

test("SourceDynamic._ofSource.test", () => {
  const source = sourceChangeable(1);
  const sourceDynamic = new SourceDynamic(source, source);

  const g1 = vitest.fn();
  sourceDynamic.value(g1);
  expect(g1).toBeCalledWith(1);

  sourceDynamic.give(2);

  const g2 = vitest.fn();
  sourceDynamic.value(g2);
  expect(g2).toBeCalledWith(2);
  const g3 = vitest.fn();
  source.value(g3);
  expect(g3).toBeCalledWith(2);
});
