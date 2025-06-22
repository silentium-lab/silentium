import { Guest } from "../Guest";
import { expect, test, vi } from "vitest";
import { Source } from "../Source/Source";

test("Source._object.test", () => {
  const src = new Source({
    value(g) {
      g.give(111);
    },
  });

  const g = vi.fn();
  src.value(new Guest(g));

  expect(g).toHaveBeenCalledWith(111);
});
