import { EventType } from "../types";

/**
 * From a set of information sources we get
 * a common response from any source for a single owner
 * https://silentium-lab.github.io/silentium/#/en/information/any
 */
export function Any<T>(...infos: EventType<T>[]): EventType<T> {
  return function AnyEvent(u) {
    infos.forEach((info) => {
      info(u);
    });
  };
}
