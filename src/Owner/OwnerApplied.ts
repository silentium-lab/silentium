import { Owner } from "./Owner";

export const ownerApplied = <T, R>(
  baseowner: Owner<R>,
  applier: (value: T) => R,
) => {
  return new Owner<T>(
    (v) => {
      baseowner.give(applier(v));
    },
    (cause) => {
      baseowner.error(cause);
    },
    () => baseowner.disposed(),
  );
};
