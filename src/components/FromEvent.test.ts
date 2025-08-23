import { expect, test, vi } from "vitest";
import { FromEvent } from "./FromEvent";
import { From, Of } from "../base";

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
  const i = new FromEvent(
    new Of(emitter),
    new Of("click"),
    new Of("on"),
    new Of("off"),
  );

  const o = vi.fn();
  i.value(new From(o));

  expect(o).toBeCalledWith("click123");

  i.destroy();
  expect(unsubscribed).toBe(true);
});
