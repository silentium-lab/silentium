import { expect, test, vi } from "vitest";
import { Information } from "./Information";
import { Owner } from "../Owner";

test("Information._function.test", () => {
  const info = new Information((g) => {
    g.give(111);
  });

  const g = vi.fn();
  info.value(new Owner(g));

  expect(g).toHaveBeenCalledWith(111);
});
