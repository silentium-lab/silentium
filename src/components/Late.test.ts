import { expect, test, vi } from "vitest";
import { late } from "./Late";

test("Late.test", () => {
  const l = late<number>();

  const o = vi.fn();
  l.value(o);

  expect(o).not.toHaveBeenCalled();

  l.give(1);

  expect(o).toHaveBeenCalledWith(1);

  l.give(2);

  expect(o).toHaveBeenCalledWith(2);
});
