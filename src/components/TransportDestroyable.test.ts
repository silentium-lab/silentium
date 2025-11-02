import { describe, expect, test } from "vitest";
import { TransportDestroyable } from "components/TransportDestroyable";
import { TransportEvent } from "base/Transport";
import { Void } from "base/Void";

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
