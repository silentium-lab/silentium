import { expect, test, vi } from "vitest";
import { Guest } from "../Guest";
import { of } from "../Source/Of";

test("Of.test", () => {
  const [ofs, ofg] = of<number>();

  const g = vi.fn();
  ofs.value(new Guest(g));

  expect(g).not.toHaveBeenCalled();

  ofg.give(1);

  expect(g).toHaveBeenCalledWith(1);

  ofg.give(2);

  expect(g).toHaveBeenCalledWith(2);

  ofs.destroy();
  expect(ofs.hasGuest()).toBe(false);
});
