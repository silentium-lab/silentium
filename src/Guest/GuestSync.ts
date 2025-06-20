import { GuestObjectType } from "../types/GuestType";

export interface GuestValueType<T = any> extends GuestObjectType<T> {
  value(): T;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/guest/guest-sync
 */
export const guestSync = <T>(theValue?: T): GuestValueType<T> => {
  const result = {
    give(value: T) {
      theValue = value;
      return result;
    },
    value() {
      if (theValue === undefined) {
        throw new Error("no value in GuestSync!");
      }
      return theValue;
    },
  };

  return result;
};
