import {
  give,
  GuestExecutorType,
  GuestObjectType,
  GuestType,
} from "../Guest/Guest";

/**
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
