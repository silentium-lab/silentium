import { expect, test, vitest } from "vitest";
import { patron } from "../Patron/Patron";
import { value } from "../Source/Source";
import { sourceAll } from "./SourceAll";
import { sourceOf } from "./SourceChangeable";
import { sourceSync } from "../Source/SourceSync";
import { patronPoolsStatistic } from "../Patron/PatronPool";

test("SourceAll._withPatron.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
  const one = sourceOf<number>(1);
  const two = sourceOf<number>(2);
  const all = sourceAll([one.value, two.value]);

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
