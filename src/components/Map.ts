import { InformationType, LazyType } from "../types";
import { all } from "./All";
import { i } from "./Information";

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 * https://silentium-lab.github.io/silentium/#/en/information/map
 */
export const map = <T, TG>(
  base: InformationType<T[]>,
  targetI: LazyType<TG>,
): InformationType<TG[]> => {
  return (g) => {
    base((v) => {
      const infos: InformationType<TG>[] = [];
      v.forEach((val) => {
        let valInfo: InformationType<T> | T = val;
        if (typeof valInfo !== "function") {
          valInfo = i(valInfo);
        }
        const info = targetI(valInfo);
        infos.push(info);
      });
      const allI = all(...infos);
      allI(g);
    });
  };
};
