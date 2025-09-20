import { From } from "../base";
import { Applied } from "../components/Applied";
import { LateShared } from "../components/LateShared";
import { PrimitiveSource } from "../components/PrimitiveSource";
import { expect, test, vi } from "vitest";

test("PrimitiveSource.test", () => {
  const l = new LateShared(1);
  const primitive = new PrimitiveSource(l);
  const l2 = new LateShared(2);

  const r = new Applied(l2, (a) => ["src", primitive, a].join("_"));
  const g = vi.fn();
  r.value(new From(g));

  expect(g).toHaveBeenLastCalledWith("src_1_2");

  l.give(3);
  expect(g).toHaveBeenLastCalledWith("src_1_2");

  l2.give(4);
  expect(g).toHaveBeenLastCalledWith("src_3_4");
});
