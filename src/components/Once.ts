import { InformationType } from "../types";

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 * https://silentium-lab.github.io/silentium/#/en/information/once
 */
export const once = <T>(base: InformationType<T>): InformationType<T> => {
  return (owner) => {
    let isFilled = false;
    base((v) => {
      if (!isFilled) {
        isFilled = true;
        owner(v);
      }
    });
  };
};
