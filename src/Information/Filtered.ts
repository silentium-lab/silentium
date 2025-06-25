import { O } from "../Owner/Owner";
import { Information } from "./Information";

/**
 * Information whose value is being validated
 * via a predicate; if the predicate returns true, the value
 * can be passed to the output
 * https://silentium-lab.github.io/silentium/#/en/information/filtered
 */
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
