import { value } from "../Source/Source";
import { expect, test, vitest } from "vitest";
import { Patron } from "../Patron/Patron";
import { sourceAll } from "./SourceAll";
import { sourceChangeable } from "./SourceChangeable";

test("SourceAll._withPatron.test", () => {
  const one = sourceChangeable(1);
  const two = sourceChangeable(2);
  const all = sourceAll<{ one: number; two: number }>({
    one,
    two,
  });

  one.give(3);
  one.give(4);

  const g = vitest.fn();
  value(
    all,
    new Patron((value: Record<string, unknown>) => {
      g(Object.values(value).length);
    }),
  );

  expect(g).toBeCalledWith(2);
});
