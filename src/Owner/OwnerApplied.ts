import { Owner } from "./Owner";

/**
 * Owner to which a function is applied that modifies the incoming
 * value it receives
 * https://silentium-lab.github.io/silentium/#/en/owner/applied
 */
export const ownerApplied = <T, R>(
  base: Owner<R>,
  applier: (value: T) => R,
) => {
  return new Owner<T>(
    (v) => {
      base.give(applier(v));
    },
    (cause) => {
      base.error(cause);
    },
    () => base.disposed(),
  );
};
