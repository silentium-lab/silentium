import { Owner } from "./Owner";

/**
 * Owner to which the function is applied that
 * controls the conditions for passing the value
 * https://silentium-lab.github.io/silentium/#/en/owner/executor-applied
 */
export const ownerExecutorApplied = <T>(
  base: Owner<T>,
  applier: (ge: (v: T) => void) => (v: T) => void,
) => {
  const executor = applier((v) => base.give(v));
  return new Owner<T>((v) => {
    executor(v);
  });
};
