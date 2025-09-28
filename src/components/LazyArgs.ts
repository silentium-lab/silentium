import { DataType, ValueType } from "../types";

export const lazyArgs = (
  baseLazy: ValueType<any[], DataType>,
  args: unknown[],
  startFromArgIndex: number = 0,
) => {
  return (...runArgs: any[]) => {
    return baseLazy(...mergeAtIndex(runArgs, args, startFromArgIndex));
  };
};

function mergeAtIndex(arr1: unknown[], arr2: unknown[], index: number) {
  const result = arr1.slice(0, index);
  while (result.length < index) result.push(undefined);
  return result.concat(arr2);
}
