import { expect, test, vi } from "vitest";
import { Source } from "../Source/Source";
import { Guest } from "../Guest";

test("Source._function.test", () => {
  const src = new Source((g) => {
    g.give(111);
  });

  const g = vi.fn();
  src.value(new Guest(g));

  expect(g).toHaveBeenCalledWith(111);
});
