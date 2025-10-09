import { DataType } from "../types";

/**
 * From a set of information sources we get
 * a common response from any source for a single owner
 * https://silentium-lab.github.io/silentium/#/en/information/any
 */
export const any = <T>(...infos: DataType<T>[]): DataType<T> => {
  return function AnyData(u) {
    infos.forEach((info) => {
      info(u);
    });
  };
};
