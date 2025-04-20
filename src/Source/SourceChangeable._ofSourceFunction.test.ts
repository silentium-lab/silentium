import { expect, test, vitest } from "vitest";
import { give } from "../Guest/Guest";
import { SourceChangeable } from "./SourceChangeable";

test("SourceChangeable._ofSourceFunction.test", () => {
  const source = new SourceChangeable((g) => give(50, g));

  const g = vitest.fn();
  source.value(g);
  expect(g).toBeCalledWith(50);
});
