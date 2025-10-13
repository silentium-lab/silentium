import { EventType, ConstructorType } from "../types";

export function ConstructorArgs(
  baseConstructor: ConstructorType<any[], EventType>,
  args: unknown[],
  startFromArgIndex: number = 0,
) {
  return function ConstructorArgsEvent(...runArgs: any[]) {
    return baseConstructor(...mergeAtIndex(runArgs, args, startFromArgIndex));
  };
}

function mergeAtIndex(arr1: unknown[], arr2: unknown[], index: number) {
  const result = arr1.slice(0, index);
  while (result.length < index) result.push(undefined);
  return result.concat(arr2);
}
