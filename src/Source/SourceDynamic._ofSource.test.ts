import { sourceDynamic } from "./SourceDynamic";
import { sourceChangeable } from "./SourceChangeable";
import { expect, test, vitest } from "vitest";

test("SourceDynamic._ofSource.test", () => {
  const source = sourceChangeable(1);
  const sd = sourceDynamic(source, source);

  const g1 = vitest.fn();
  sd.value(g1);
  expect(g1).toBeCalledWith(1);

  sd.give(2);

  const g2 = vitest.fn();
  sd.value(g2);
  expect(g2).toBeCalledWith(2);
  const g3 = vitest.fn();
  source.value(g3);
  expect(g3).toBeCalledWith(2);
});
