import { expect, test, vitest } from "vitest";
import { SourceAll } from "./SourceAll";
import { SourceChangeable } from "./SourceChangeable";
import { Patron } from "../Patron/Patron";

test("SourceAll._withPatron.test", () => {
  const one = new SourceChangeable(1);
  const two = new SourceChangeable(2);
  const all = new SourceAll<{ one: number; two: number }>();

  one.value(new Patron(all.guestKey("one")));
  two.value(new Patron(all.guestKey("two")));

  one.give(3);
  one.give(4);

  const g = vitest.fn();
  all.value(
    new Patron((value: Record<string, unknown>) => {
      g(Object.values(value).length);
    }),
  );

  expect(g).toBeCalledWith(2);
});
