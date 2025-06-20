import { value } from "../Source/Source";
import { expect, test } from "vitest";
import { patron, systemPatron } from "./Patron";
import { sourceOf } from "../Source/SourceChangeable";

test("Patron._system.test", () => {
  const src = sourceOf();
  const responses: string[] = [];
  value(src, [
    patron((v) => {
      responses.push("regular" + v);
    }),
    systemPatron((v) => {
      responses.push("system" + v);
    }),
  ]);

  src.give(1);

  expect(responses).toStrictEqual(["system1", "regular1"]);
});
