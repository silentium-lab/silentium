import { expect, test, vi } from "vitest";
import { fromEvent } from "./FromEvent";

test("FromEvent.test", () => {
  let unsubscribed = false;
  const emitter = {
    on(name: string, h: (v: string) => void) {
      h(name + "123");
    },
    off() {
      unsubscribed = true;
    },
  };
  const i = fromEvent(emitter, "click", "on", "off");

  const o = vi.fn();
  const destroy = i(o);

  expect(o).toBeCalledWith(["click123"]);

  destroy?.();
  expect(unsubscribed).toBe(true);
});
