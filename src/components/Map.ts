import { From, Lazy, Of, TheInformation, TheOwner } from "../base";
import { All } from "./All";

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 * https://silentium-lab.github.io/silentium/#/en/information/map
 */
export class Map<T, TG> extends TheInformation<TG[]> {
  public constructor(
    private baseSrc: TheInformation<T[]>,
    private targetSrc: Lazy<TG>,
  ) {
    super(baseSrc, targetSrc);
  }

  public value(o: TheOwner<TG[]>) {
    this.baseSrc.value(
      new From((v) => {
        const infos: TheInformation<TG>[] = [];
        v.forEach((val) => {
          let valInfo: TheInformation<T> | T = val;
          if (!(valInfo instanceof TheInformation)) {
            valInfo = new Of(valInfo);
          }
          const info = this.targetSrc.get(valInfo);
          infos.push(info);
        });
        const allI = new All(...infos);
        allI.value(o);
      }),
    );
    return this;
  }
}
