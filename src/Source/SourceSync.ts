import { GuestType } from "../Guest/Guest";
import { GuestSync } from "../Guest/GuestSync";
import { Patron } from "../Patron/Patron";
import { SourceObjectType, SourceType, value } from "../Source/Source";

/**
 * Helps to represent source value as sync value, what can be returned
 * useful for example in tests
 * @url https://silentium-lab.github.io/silentium/#/source/source-sync
 */
export const sourceSync = <T>(
  baseSource: SourceType<T>,
): SourceObjectType<T> & { syncValue(): T } => {
  const syncGuest = new GuestSync<T>();
  value(baseSource, new Patron(syncGuest));

  return {
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
};
