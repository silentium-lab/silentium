import { DataType, ValueType } from "../types";

/**
 * Information whose value is being validated
 * via a predicate; if the predicate returns true, the value
 * can be passed to the output
 * https://silentium-lab.github.io/silentium/#/en/information/filtered
 */
export const filtered = <T>(
  baseSrc: DataType<T>,
  predicate: ValueType<[T], boolean>,
  defaultValue?: T,
): DataType<T> => {
  return function FilteredData(u) {
    baseSrc(function FilteredBaseUser(v) {
      if (predicate(v)) {
        u(v);
      } else if (defaultValue !== undefined) {
        u(defaultValue);
      }
    });
  };
};
