import { expect, test, vi } from "vitest";
import { Guest } from "../Guest";
import { of } from "../Source/Of";

test("Of.test", () => {
  const src = of<number>();

  const g = vi.fn();
  src.value(new Guest(g));

  expect(g).not.toHaveBeenCalled();

  src.next(1);

  expect(g).toHaveBeenCalledWith(1);

  src.next(2);

  expect(g).toHaveBeenCalledWith(2);
});
