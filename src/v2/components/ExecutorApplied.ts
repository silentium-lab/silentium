import { InformationType, OwnerType } from "../types";

/**
 * Information to which a function is applied in order
 * to control the value passing process
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
export const executorApplied = <T>(
  base: InformationType<T>,
  applier: (executor: OwnerType<T>) => OwnerType<T>,
): InformationType<T> => {
  return (owner) => {
    base(applier(owner));
  };
};
