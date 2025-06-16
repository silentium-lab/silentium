import { expect, test } from "vitest";
import { sourceOf } from "./SourceChangeable";
import { patron } from "../Patron/Patron";
import { withName } from "../utils/Nameable";

test("SourceChangeable._sequence.test", () => {
  const source = sourceOf<number>(1);
  const sequence: string[] = [];
  const subSource1 = sourceOf();
  subSource1.value(
    withName(
      patron((v) => {
        sequence.push(`one_${v}`);
      }),
      "sub_src1_patron",
    ),
  );
  const subSource2 = sourceOf();
  subSource2.value(
    withName(
      patron((v) => {
        sequence.push(`two_${v}`);
      }),
      "sub_src2_patron",
    ),
  );
  source.value(withName(patron(subSource1), "src1_patron"));
  source.value(withName(patron(subSource2), "src2_patron"));

  source.give(2);
  source.give(3);

  expect(sequence).toStrictEqual([
    "one_1",
    "two_1",
    "one_2",
    "two_2",
    "one_3",
    "two_3",
  ]);
});
