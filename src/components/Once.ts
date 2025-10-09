import { DataType } from "../types";

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 * https://silentium-lab.github.io/silentium/#/en/information/once
 */
export const once = <T>(baseSrc: DataType<T>): DataType<T> => {
  return function OnceData(u) {
    let isFilled = false;
    baseSrc(function OnceBaseUser(v) {
      if (!isFilled) {
        isFilled = true;
        u(v);
      }
    });
  };
};
