import { InformationType } from "../types";

/**
 * A component that takes one value at a time and returns
 * an array of all previous values
 * https://silentium-lab.github.io/silentium/#/en/information/sequence
 */
export const sequence = <T>(base: InformationType<T>): InformationType<T[]> => {
  return (o) => {
    const result: T[] = [];

    base((v) => {
      result.push(v);
      o(result);
    });
  };
};
