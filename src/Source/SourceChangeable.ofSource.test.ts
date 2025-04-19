import { expect, test, vitest } from "vitest";
import { SourceChangeable } from "./SourceChangeable";
import { Source } from "../Source/Source";
import { give } from "../Guest/Guest";

test("SourceChangeable.ofSource.test", () => {
  const source = new SourceChangeable(
    new Source((g) => {
      give(52, g);
    }),
  );

  const g = vitest.fn();
  source.value(g);
  expect(g).toBeCalledWith(52);
});
