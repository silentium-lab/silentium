import { EventType } from "../types";

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 * https://silentium-lab.github.io/silentium/#/en/information/once
 */
export function Once<T>(baseEv: EventType<T>): EventType<T> {
  return function OnceEvent(user) {
    let isFilled = false;
    baseEv(function OnceBaseUser(v) {
      if (!isFilled) {
        isFilled = true;
        user(v);
      }
    });
  };
}
