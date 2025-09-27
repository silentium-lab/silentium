import { expect, test, vi } from "vitest";
import { of } from "../base";
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
  const i = fromEvent(of(emitter), of("click"), of("on"), of("off"));

  const o = vi.fn();
  i.value(o);

  expect(o).toBeCalledWith("click123");

  i.destroy();
  expect(unsubscribed).toBe(true);
});
