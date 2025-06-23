import { G } from "../Guest";
import { S } from "../Source/Source";
import { expect, test, vi } from "vitest";
import { applied } from "../Source/SourceApplied";

test("SourceApplied.test", () => {
  const source = S(2);
  const sourceDouble = applied(source, (x) => x * 2);

  const g = vi.fn();
  sourceDouble.value(G(g));

  expect(g).toBeCalledWith(4);
});
