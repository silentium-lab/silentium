import { describe, expect, test } from "vitest";
import { TransportEvent, Void } from "../base";
import { TransportDestroyable } from "../components/TransportDestroyable";

describe("TransportDestroyable.test", () => {
  test("destroy base constructor", () => {
    let isDestroyed = false;
    const p = TransportDestroyable(
      TransportEvent(() => ({
        event(transport) {
          transport.use([123]);
          return this;
        },
        destroy() {
          isDestroyed = true;
          return this;
        },
      })),
    );
    const inst = p.use([]);

    inst.event(Void());

    p.destroy();

    expect(isDestroyed).toBe(true);
  });
});
