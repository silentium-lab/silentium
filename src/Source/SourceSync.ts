import { subSource } from "../Patron/PatronPool";
import { GuestType } from "../Guest/Guest";
import { guestSync } from "../Guest/GuestSync";
import { patron } from "../Patron/Patron";
import { SourceObjectType, SourceType, value } from "../Source/Source";

/**
 * Helps to represent source value as sync value, what can be returned
 * useful for example in tests
 * This source is not lazy! When we create it patron visit baseSource
 * @url https://silentium-lab.github.io/silentium/#/source/source-sync
 */
export const sourceSync = <T>(
  baseSource: SourceType<T>,
  defaultValue?: unknown,
): SourceObjectType<T> & { syncValue(): T } => {
  const syncGuest = guestSync<T>(defaultValue as T);
  value(baseSource, patron(syncGuest));

  const result = {
    value(guest: GuestType<T>) {
      value(baseSource, guest);
      return this;
    },
    syncValue() {
      try {
        return syncGuest.value() as T;
      } catch {
        throw new Error("No value in SourceSync");
      }
    },
  };
  subSource(result, baseSource);

  return result;
};
