import { GuestObjectType, GuestType } from "../types/GuestType";
import { give } from "./Guest";

export interface GuestDisposableType<T = any> extends GuestObjectType<T> {
  disposed(value: T | null): boolean;
}

export type MaybeDisposableType<T = any> = Partial<GuestDisposableType<T>>;

/**
 * Connects to guest logic what can tell PatronPool
 * what guest don't need to receive new values
 * @url https://silentium-lab.github.io/silentium/#/guest/guest-disposable
 */
export const guestDisposable = <T>(
  guest: GuestType,
  disposeCheck: (value: T | null) => boolean,
): GuestDisposableType<T> => {
  if (guest === undefined) {
    throw new Error("GuestDisposable didn't receive guest argument");
  }
  if (disposeCheck === undefined) {
    throw new Error("GuestDisposable didn't receive disposeCheck argument");
  }

  const result = {
    disposed(value: T | null): boolean {
      return disposeCheck(value);
    },
    give(value: T) {
      give(value, guest);
      return result;
    },
  };

  return result;
};
