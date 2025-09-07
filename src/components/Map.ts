import {
  Destroyable,
  From,
  InformationType,
  Lazy,
  Of,
  OwnerType,
  TheInformation,
} from "../base";
import { All } from "./All";

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 * https://silentium-lab.github.io/silentium/#/en/information/map
 */
export class Map<T, TG> extends TheInformation<TG[]> {
  public constructor(
    private baseSrc: InformationType<T[]>,
    private targetSrc: Lazy<TG>,
  ) {
    super(baseSrc, targetSrc);
  }

  public value(o: OwnerType<TG[]>) {
    const infos: InformationType<TG>[] = [];
    this.baseSrc.value(
      new From((v) => {
        infos.forEach((i) => {
          (i as unknown as Destroyable)?.destroy();
        });
        infos.length = 0;
        v.forEach((val) => {
          let valInfo: InformationType<T> | T = val;
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
