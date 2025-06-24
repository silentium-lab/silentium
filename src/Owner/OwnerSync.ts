import { Information } from "../Information";
import { O } from ".";

export interface infoSync<T> {
  syncValue(): T;
}

export const ownerSync = <T>(
  baseinfo: Information<T>,
  defaultValue?: T,
): infoSync<T> => {
  let lastValue: T | undefined;

  baseinfo.value(
    O((v) => {
      lastValue = v;
    }),
  );

  return {
    syncValue() {
      if (lastValue === undefined && defaultValue === undefined) {
        throw new Error("info sync is empty");
      }
      return (lastValue || defaultValue) as T;
    },
  };
};
