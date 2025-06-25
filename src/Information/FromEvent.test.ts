import { fromEvent } from "../Information";
import { expect, test, vi } from "vitest";
import { O } from "../Owner";

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
  i.value(O(o));

  expect(o).toBeCalledWith(["click123"]);

  i.destroy();
  expect(unsubscribed).toBe(true);
});
