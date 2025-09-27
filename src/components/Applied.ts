import { DataType, ValueType } from "../types";

/**
 * Information to which the function was applied to change the value
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
export const applied = <T, R>(
  baseSrc: DataType<T>,
  applier: ValueType<[T], R>,
): DataType<R> => {
  return (u) => {
    baseSrc((v) => {
      u(applier(v));
    });
  };
};
