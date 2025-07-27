import { InformationType, OwnerType } from "../types";

/**
 * Information to which the function was applied to change the value
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
export const applied = <T, R>(
  base: InformationType<T>,
  applier: (v: T) => R,
): InformationType<R> => {
  return (g: OwnerType<R>) => {
    base((v) => {
      g(applier(v));
    });
  };
};
