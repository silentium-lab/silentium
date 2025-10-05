import { DataType } from "src/types";

/**
 * Create local copy of source what can be destroyed
 */
export const local = <T>(baseSrc: DataType<T>): DataType<T> => {
  return function Local(user) {
    let destroyed = false;
    const d = baseSrc((v) => {
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
