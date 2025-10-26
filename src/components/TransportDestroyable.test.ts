import { describe, expect, test } from "vitest";
import { Void } from "../base";
import { Transport } from "../components/Transport";
import { TransportDestroyable } from "../components/TransportDestroyable";

describe("TransportDestroyable.test", () => {
  test("destroy base constructor", () => {
    let isDestroyed = false;
    const p = new TransportDestroyable(
      new Transport(() => ({
        event(u) {
          u.use(123);
          return this;
        },
        destroy() {
          isDestroyed = true;
          return this;
        },
      })),
    );
    const inst = p.of();

    inst.event(new Void());

    p.destroy();

    expect(isDestroyed).toBe(true);
  });
});
