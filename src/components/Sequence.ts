import { DataType } from "../types";

/**
 * A component that takes one value at a time and returns
 * an array of all previous values
 * https://silentium-lab.github.io/silentium/#/en/information/sequence
 */
export const sequence = <T>(baseSrc: DataType<T>): DataType<T[]> => {
  return function SequenceData(u) {
    const result: T[] = [];
    baseSrc(function SequenceBaseUser(v) {
      result.push(v);
      u(result);
    });
  };
};
