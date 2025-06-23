import { expect, test, vi } from "vitest";
import { S } from "../Source/Source";
import { all } from "../Source/SourceAll";
import { G } from "../Guest";

test("SourceAll._asArray.test", () => {
  const one = S(1);
  const two = S(2);
  const a = all(one, two);

  const g = vi.fn();
  a.value(G(g));

  expect(g).toBeCalledWith([1, 2]);
});
