import { Information } from "../Information";
import { O } from ".";

export interface infoSync<T> {
  syncValue(): T;
}

/**
 * Owner that can return a synchronous value
 * from the information passed to it. If there is no value and no
 * defaultValue, an error will occur
 * https://silentium-lab.github.io/silentium/#/en/owner/sync
 */
export const ownerSync = <T>(
  base: Information<T>,
  defaultValue?: T,
): infoSync<T> => {
  let lastValue: T | undefined;

  base.value(
    O((v) => {
      lastValue = v;
    }),
  );

  return {
    syncValue() {
      if (lastValue === undefined && defaultValue === undefined) {
        throw new Error("info sync is empty");
      }
      return (lastValue ?? defaultValue) as T;
    },
  };
};
