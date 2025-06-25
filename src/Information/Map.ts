import { InformationDataType } from "../types";
import { O } from "../Owner/Owner";
import { LazyType } from "../types/LazyType";
import { all } from "./All";
import { I, Information } from "./Information";

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 * https://silentium-lab.github.io/silentium/#/en/information/map
 */
export const map = <T, TG>(
  base: Information<T[]>,
  targetI: LazyType<Information<TG>>,
) => {
  const i = new Information<TG[]>((g) => {
    base.value(
      O((v) => {
        const infos: Information<TG>[] = [];
        v.forEach((val) => {
          let valInfo: Information<T> | T = val;
          if (!(valInfo instanceof Information)) {
            valInfo = I(val as InformationDataType<T>);
          }
          const info = targetI.get(valInfo);
          infos.push(info);
        });
        const allI = all(...infos).value(g);
        i.subInfo(allI);
      }),
    );
  });
  i.subInfo(base);

  return i;
};
