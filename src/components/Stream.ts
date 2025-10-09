import { DataType } from "../types";

/**
 * Component that receives a data array and yields values one by one
 * https://silentium-lab.github.io/silentium/#/en/information/stream
 */
export const stream = <T>(baseSrc: DataType<T[]>): DataType<T> => {
  return function StreamData(u) {
    baseSrc(function StreamBaseUser(v) {
      v.forEach((cv) => {
        u(cv);
      });
    });
  };
};
