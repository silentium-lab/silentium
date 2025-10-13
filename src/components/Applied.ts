import { EventType, ConstructorType } from "../types";

/**
 * Information to which the function was applied to change the value
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
export function Applied<T, R>(
  baseEv: EventType<T>,
  applier: ConstructorType<[T], R>,
): EventType<R> {
  return function AppliedEvent(user) {
    baseEv(function AppliedBaseUser(v) {
      user(applier(v));
    });
  };
}
