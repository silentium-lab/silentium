import { EventType, ConstructorType } from "../types";

/**
 * Information whose value is being validated
 * via a predicate; if the predicate returns true, the value
 * can be passed to the output
 * https://silentium-lab.github.io/silentium/#/en/information/filtered
 */
export const filtered = <T>(
  baseEv: EventType<T>,
  predicate: ConstructorType<[T], boolean>,
  defaultValue?: T,
): EventType<T> => {
  return function FilteredEvent(u) {
    baseEv(function FilteredBaseUser(v) {
      if (predicate(v)) {
        u(v);
      } else if (defaultValue !== undefined) {
        u(defaultValue);
      }
    });
  };
};
