import { O } from "../Owner";
import { Information } from "./Information";

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 * https://silentium-lab.github.io/silentium/#/en/information/once
 */
export const once = <T>(base: Information<T>) => {
  const info = new Information<T>((g) => {
    let isFilled = false;
    base.value(
      O((v) => {
        if (!isFilled) {
          isFilled = true;
          g.give(v);
        }
      }),
    );
  });
  info.subInfo(base);

  return info;
};
