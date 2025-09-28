import { DataType, ValueType } from "../types";
import { of } from "../base";
import { all } from "./All";

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 * https://silentium-lab.github.io/silentium/#/en/information/map
 */
export const map = <T, TG>(
  baseSrc: DataType<T[]>,
  targetSrc: ValueType<any[], DataType<TG>>,
): DataType<TG[]> => {
  return (u) => {
    baseSrc((v) => {
      const infos: DataType<TG>[] = [];
      v.forEach((val) => {
        let valInfo: DataType<T> | T = val;
        if (typeof valInfo !== "function") {
          valInfo = of(valInfo);
        }
        const info = targetSrc(valInfo);
        infos.push(info);
      });
      const allI = all(...infos);
      allI(u);
    });
  };
};
