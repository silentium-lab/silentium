import { _void, of } from "../base";
import { constructorDestroyable } from "./ConstructorDestroyable";
import { describe, expect, test } from "vitest";

describe("ConstructorDestroyable.test", () => {
  test("destroy base constructor", () => {
    let isDestroyed = false;
    const p = constructorDestroyable(() => ({
      event: of("123"),
      destroy() {
        isDestroyed = true;
      },
    }));
    const inst = p.get();

    inst(_void);

    p.destroy();

    expect(isDestroyed).toBe(true);
  });

  test("destroy event type", () => {
    let isDestroyed = false;
    const p = constructorDestroyable(() => {
      return () => {
        return () => {
          isDestroyed = true;
        };
      };
    });
    const inst = p.get();
    const d = inst(_void);

    d?.();

    expect(isDestroyed).toBe(true);
  });
});
