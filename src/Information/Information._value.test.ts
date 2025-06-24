import { Owner } from "../Owner";
import { Information } from "./Information";
import { expect, test, vi } from "vitest";

test("Information._value.test", () => {
  const info = new Information(111);

  const g = vi.fn();
  info.value(new Owner(g));

  expect(g).toHaveBeenCalledWith(111);
});
