import { introduction } from "../Patron/Patron";
import { GuestExecutorType, GuestType } from "../Guest/Guest";
import { guestExecutorApplied } from "../Guest/GuestExecutorApplied";

/**
 * Helps to apply function to patrons executor
 * @url https://silentium-lab.github.io/silentium/#/patron/patron-executor-applied
 */
export const patronExecutorApplied = <T>(
  baseGuest: GuestType<T>,
  applier: (executor: GuestExecutorType) => GuestExecutorType,
) => {
  const guestApplied = guestExecutorApplied(baseGuest, applier);

  const result = {
    give(value: T) {
      guestApplied.give(value);
      return result;
    },
    introduction,
  };

  return result;
};
