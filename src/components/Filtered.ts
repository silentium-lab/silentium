import { EventType, ConstructorType } from "../types";

/**
 * Information whose value is being validated
 * via a predicate; if the predicate returns true, the value
 * can be passed to the output
 * https://silentium-lab.github.io/silentium/#/en/information/filtered
 */
export function Filtered<T>(
  baseEv: EventType<T>,
  predicate: ConstructorType<[T], boolean>,
  defaultValue?: T,
): EventType<T> {
  return function FilteredEvent(user) {
    baseEv(function FilteredBaseUser(v) {
      if (predicate(v)) {
        user(v);
      } else if (defaultValue !== undefined) {
        user(defaultValue);
      }
    });
  };
}
