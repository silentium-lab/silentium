import { Guest } from "../Guest";
import { Source } from "../Source/Source";
import { expect, test, vi } from "vitest";

test("Source._value.test", () => {
  const src = new Source(111);

  const g = vi.fn();
  src.value(new Guest(g));

  expect(g).toHaveBeenCalledWith(111);
});
