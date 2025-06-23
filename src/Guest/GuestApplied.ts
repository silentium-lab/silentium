import { GuestObjectType, GuestType } from "../types/GuestType";
import { give, Guest } from "../Guest/Guest";

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

export const appliedG = <T, R>(
  baseGuest: Guest<R>,
  applier: (value: T) => R,
) => {
  return new Guest<T>(
    (v) => {
      baseGuest.give(applier(v));
    },
    (cause) => {
      baseGuest.error(cause);
    },
    () => baseGuest.disposed(),
  );
};
