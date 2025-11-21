import { describe, expect, test, vi } from "vitest";
import { FromEvent } from "components/FromEvent";
import { Of } from "base/Of";

describe("FromEvent.test", () => {
  test("from event with destructor", () => {
    let unsubscribed = false;
    const emitter = {
      on(name: string, h: (v: string) => void) {
        h(name + "123");
      },
      off() {
        unsubscribed = true;
      },
    };
    const i = FromEvent(Of(emitter), Of("click"), Of("on"), Of("off"));

    const o = vi.fn();
    i.then(o);

    expect(o).toBeCalledWith("click123");

    i.destroy();
    expect(unsubscribed).toBe(true);
  });

  test("from event with destructor values", () => {
    let unsubscribed = false;
    const emitter = {
      on(name: string, h: (v: string) => void) {
        h(name + "123");
      },
      off() {
        unsubscribed = true;
      },
    };
    const i = FromEvent(emitter, "click", "on", "off");

    const o = vi.fn();
    i.then(o);

    expect(o).toBeCalledWith("click123");

    i.destroy();
    expect(unsubscribed).toBe(true);
  });
});
