import { describe, expect, test } from "vitest";
import { TapDestroyable } from "components/TapDestroyable";
import { TapMessage } from "base/Tap";
import { Void } from "base/Void";

describe("TapDestroyable.test", () => {
  test("destroy base constructor", () => {
    let isDestroyed = false;
    const p = TapDestroyable(
      TapMessage(() => ({
        pipe(tap) {
          tap.use([123]);
          return this;
        },
        destroy() {
          isDestroyed = true;
          return this;
        },
      })),
    );
    const inst = p.use([]);

    inst.pipe(Void());

    p.destroy();

    expect(isDestroyed).toBe(true);
  });
});
