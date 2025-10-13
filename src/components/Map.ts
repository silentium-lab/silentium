import { EventType, ConstructorType } from "../types";
import { Of } from "../base";
import { All } from "./All";

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 * https://silentium-lab.github.io/silentium/#/en/information/map
 */
export function Map<T, TG>(
  baseEv: EventType<T[]>,
  targetEv: ConstructorType<any[], EventType<TG>>,
): EventType<TG[]> {
  return function MapData(user) {
    baseEv(function MapBaseUser(v) {
      const infos: EventType<TG>[] = [];
      v.forEach((val) => {
        let valInfo: EventType<T> | T = val;
        if (typeof valInfo !== "function") {
          valInfo = Of(valInfo);
        }
        const info = targetEv(valInfo);
        infos.push(info);
      });
      const allI = All(...infos);
      allI(user);
    });
  };
}
