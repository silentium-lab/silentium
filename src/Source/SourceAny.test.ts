import { of } from "../Source/Of";
import { S } from "../Source/Source";
import { expect, test, vi } from "vitest";
import { any } from "../Source/SourceAny";
import { G } from "../Guest";

test("SourceAny.test", () => {
  const [laterSrc, laterG] = of<number>();
  const defaultSrc = S("default");

  const anySrc = any<any>([laterSrc, defaultSrc]);

  const g = vi.fn();
  anySrc.value(G(g));

  expect(g).toHaveBeenCalledWith("default");

  laterG.give(999);

  expect(g).toBeCalledWith(999);
});
