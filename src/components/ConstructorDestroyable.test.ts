import { constructorDestroyable } from "./ConstructorDestroyable";
import { describe, expect, test } from "vitest";

describe("ConstructorDestroyable.test", () => {
  test("destroy base constructor", () => {
    let isDestroyed = false;
    const p = constructorDestroyable(() => ({
      destroy() {
        isDestroyed = true;
      },
    }));
    const inst = p.get();

    inst.destroy();

    expect(isDestroyed).toBe(true);
  });
});
