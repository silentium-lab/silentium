import { expect, test, vitest } from "vitest";
import { patron } from "../Patron/Patron";
import { value } from "../Source/Source";
import { sourceAll } from "./SourceAll";
import { sourceChangeable } from "./SourceChangeable";

test("SourceAll._withPatron.test", () => {
  const one = sourceChangeable<number>(1);
  const two = sourceChangeable<number>(2);
  const all = sourceAll<{ one: number; two: number }>({
    one,
    two,
  });

  one.give(3);
  one.give(4);

  const g = vitest.fn();
  value(
    all,
    patron((value) => {
      g(Object.values(value).length);
    }),
  );

  expect(g).toBeCalledWith(2);
});
