import { GuestObjectType, GuestType } from "../types/GuestType";
import { give } from "../Guest/Guest";

/**
 * Helps to apply function to value before baseGuest will receive it
 * @url https://silentium-lab.github.io/silentium/#/guest/guest-applied
 */
export const guestApplied = <T, R>(
  baseGuest: GuestType<R>,
  applier: (value: T) => R,
): GuestObjectType<T> => {
  const result = {
    give(value: T) {
      give(applier(value), baseGuest);
      return result;
    },
  };
  return result;
};
