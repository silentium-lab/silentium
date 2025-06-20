import { GuestType } from "../types/GuestType";
import { give } from "./Guest";
import { GuestDisposableType, MaybeDisposableType } from "./GuestDisposable";

/**
 * Helps to inherit guest behavior, its introduction and dispose settings
 * @url https://silentium-lab.github.io/silentium/#/guest/guest-cast
 */
export const guestCast = <T>(
  sourceGuest: GuestType<any>,
  targetGuest: GuestType<T>,
): GuestDisposableType<T> => {
  if (sourceGuest === undefined) {
    throw new Error("GuestCast didn't receive sourceGuest argument");
  }
  if (targetGuest === undefined) {
    throw new Error("GuestCast didn't receive targetGuest argument");
  }

  const result = {
    disposed(value: T | null): boolean {
      const maybeDisposable = sourceGuest as MaybeDisposableType;
      return maybeDisposable.disposed ? maybeDisposable.disposed(value) : false;
    },
    give(value: T) {
      give(value, targetGuest);
      return result;
    },
    introduction() {
      if (typeof sourceGuest === "function") {
        return "guest";
      }
      if (!sourceGuest.introduction) {
        return "guest";
      }
      return sourceGuest.introduction();
    },
  };

  return result;
};
