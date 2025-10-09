import { DataType } from "../types";

/**
 * Create local copy of source what can be destroyed
 */
export const local = <T>(baseSrc: DataType<T>): DataType<T> => {
  return function LocalData(user) {
    let destroyed = false;
    const d = baseSrc(function LocalBaseUser(v) {
      if (!destroyed) {
        user(v);
      }
    });
    return () => {
      destroyed = true;
      d?.();
    };
  };
};
