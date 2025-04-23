import { introduction } from "../Patron/Patron";
import { GuestObjectType, GuestType } from "../Guest/Guest";
import { guestApplied } from "../Guest/GuestApplied";

/**
 * Helps to apply function to patron
 * @url https://silentium-lab.github.io/silentium/#/patron/patron-applied
 */
export const patronApplied = <T, R>(
  baseGuest: GuestType<R>,
  applier: (value: T) => R,
): GuestObjectType<T> => {
  const applied = guestApplied(baseGuest, applier);

  const result = {
    give(value: T) {
      applied.give(value);
      return result;
    },
    introduction,
  };

  return result;
};
