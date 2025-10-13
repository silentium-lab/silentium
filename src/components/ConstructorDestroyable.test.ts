import { Void, Of } from "../base";
import { ConstructorDestroyable } from "./ConstructorDestroyable";
import { describe, expect, test } from "vitest";

describe("ConstructorDestroyable.test", () => {
  test("destroy base constructor", () => {
    let isDestroyed = false;
    const p = ConstructorDestroyable(() => ({
      event: Of("123"),
      destroy() {
        isDestroyed = true;
      },
    }));
    const inst = p.get();

    inst(Void);

    p.destroy();

    expect(isDestroyed).toBe(true);
  });

  test("destroy event type", () => {
    let isDestroyed = false;
    const p = ConstructorDestroyable(() => {
      return () => {
        return () => {
          isDestroyed = true;
        };
      };
    });
    const inst = p.get();
    const d = inst(Void);

    d?.();

    expect(isDestroyed).toBe(true);
  });
});
