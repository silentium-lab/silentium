import { expect, test, vi } from "vitest";
import { applied } from "../components/Applied";
import { lateShared } from "../components/LateShared";
import { primitive } from "../components/PrimitiveSource";

test("PrimitiveSource.test", () => {
  const l = lateShared(1);
  const p = primitive(l.value);
  const l2 = lateShared(2);

  const r = applied(l2.value, (a) => ["src", p, a].join("_"));
  const g = vi.fn();
  r(g);

  expect(g).toHaveBeenLastCalledWith("src_1_2");

  l.give(3);
  expect(g).toHaveBeenLastCalledWith("src_1_2");

  l2.give(4);
  expect(g).toHaveBeenLastCalledWith("src_3_4");
});
