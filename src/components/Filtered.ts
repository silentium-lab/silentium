import { InformationType } from "../types";

/**
 * Information whose value is being validated
 * via a predicate; if the predicate returns true, the value
 * can be passed to the output
 * https://silentium-lab.github.io/silentium/#/en/information/filtered
 */
export const filtered = <T>(
  base: InformationType<T>,
  predicate: (v: T) => boolean,
  defaultValue?: T,
): InformationType<T> => {
  return (owner) => {
    base((v) => {
      if (predicate(v)) {
        owner(v);
      } else if (defaultValue !== undefined) {
        owner(defaultValue);
      }
    });
  };
};
