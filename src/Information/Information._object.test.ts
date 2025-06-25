import { Owner } from "../Owner";
import { expect, test, vi } from "vitest";
import { Information } from "./Information";

test("Information._object.test", () => {
  const info = new Information({
    value(g) {
      g.give(111);
    },
  });

  const g = vi.fn();
  info.value(new Owner(g));

  expect(g).toHaveBeenCalledWith(111);
});
