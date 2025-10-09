import { DataType, DataUserType } from "../types";

/**
 * Information to which a function is applied in order
 * to control the value passing process
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
export const executorApplied = <T>(
  baseSrc: DataType<T>,
  applier: (executor: DataUserType<T>) => DataUserType<T>,
): DataType<T> => {
  return function ExecutorAppliedData(u) {
    const ExecutorAppliedBaseUser = applier(u);
    baseSrc(ExecutorAppliedBaseUser);
  };
};
