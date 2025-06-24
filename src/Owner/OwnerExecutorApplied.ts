import { Owner } from "./Owner";

export const ownerExecutorApplied = <T>(
  baseowner: Owner<T>,
  applier: (ge: (v: T) => void) => (v: T) => void,
) => {
  const executor = applier((v) => baseowner.give(v));
  return new Owner<T>((v) => {
    executor(v);
  });
};
