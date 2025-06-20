import {
  GuestExecutorType,
  GuestObjectType,
  GuestType,
} from "../types/GuestType";
import { give } from "../Guest/Guest";

/**
 * Apply function to guest function of receiving value, useful for debouncing or throttling
 * @url https://silentium-lab.github.io/silentium/#/guest/guest-executor-applied
 */
export const guestExecutorApplied = <T>(
  baseGuest: GuestType<T>,
  applier: (executor: GuestExecutorType<T>) => GuestExecutorType<T>,
): GuestObjectType<T> => {
  const result = {
    give: applier((v) => give(v, baseGuest)),
  };

  return result as GuestObjectType<T>;
};
