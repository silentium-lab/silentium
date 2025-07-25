import { InformationType, OwnerType } from "../types";

/**
 * Information to which the function was applied to change the value
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
export const applied = <T, R>(
  base: InformationType<T>,
  applier: (v: T) => R,
) => {
  const info = (g: OwnerType<R>) => {
    base((v) => {
      g(applier(v));
    });
  };

  return info as InformationType<R>;
};
