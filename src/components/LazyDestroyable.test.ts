import { lazyDestroyable } from "../components/LazyDestroyable";
import { expect, test } from "vitest";

test("LazyDestroyable.test", () => {
  let isDestroyed = false;
  const p = lazyDestroyable(() => ({
    destroy() {
      isDestroyed = true;
    },
  }));
  const inst = p.get();

  inst.destroy();

  expect(isDestroyed).toBe(true);
});
