import { O } from "../Owner/Owner";
import { Information } from "./Information";

export const filtered = <T>(
  base: Information<T>,
  predicate: (v: T) => boolean,
  defaultValue?: T,
) => {
  return new Information<T>((g) => {
    base.value(
      O((v) => {
        if (predicate(v)) {
          g.give(v);
        } else if (defaultValue !== undefined) {
          g.give(defaultValue);
        }
      }),
    );
  }).subInfo(base);
};
