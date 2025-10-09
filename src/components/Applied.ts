import { DataType, ValueType } from "../types";

/**
 * Information to which the function was applied to change the value
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
export const applied = <T, R>(
  baseSrc: DataType<T>,
  applier: ValueType<[T], R>,
): DataType<R> => {
  return function AppliedData(u) {
    baseSrc(function AppliedBaseUser(v) {
      u(applier(v));
    });
  };
};
