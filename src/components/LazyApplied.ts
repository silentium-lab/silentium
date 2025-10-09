import { DataType, ValueType } from "../types";

/**
 * Lazy with applied function to its results
 */
export const lazyApplied = <T>(
  baseLazy: ValueType<any[], DataType>,
  applier: (i: DataType) => DataType<T>,
): ValueType<DataType[], DataType<T>> => {
  return function LazyAppliedData(...args) {
    return applier(baseLazy(...args));
  };
};
