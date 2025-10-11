import { EventType, ConstructorType } from "../types";
import { of } from "../base";
import { all } from "./All";

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 * https://silentium-lab.github.io/silentium/#/en/information/map
 */
export const map = <T, TG>(
  baseEv: EventType<T[]>,
  targetEv: ConstructorType<any[], EventType<TG>>,
): EventType<TG[]> => {
  return function MapData(u) {
    baseEv(function MapBaseUser(v) {
      const infos: EventType<TG>[] = [];
      v.forEach((val) => {
        let valInfo: EventType<T> | T = val;
        if (typeof valInfo !== "function") {
          valInfo = of(valInfo);
        }
        const info = targetEv(valInfo);
        infos.push(info);
      });
      const allI = all(...infos);
      allI(u);
    });
  };
};
