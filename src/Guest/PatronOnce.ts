import { introduction } from "./Patron";
import { give } from "./Guest";
import { GuestType } from "../types/GuestType";
import {
  GuestDisposableType,
  MaybeDisposableType,
} from "../Guest/GuestDisposable";

/**
 * Helps to call patron only once, this will be helpful when you
 * need value but you know what value can not be existed at a time of requesting
 * @url https://silentium-lab.github.io/silentium/#/patron/patron-once
 */
export const patronOnce = <T>(
  baseGuest: GuestType<T>,
): GuestDisposableType<T> => {
  if (baseGuest === undefined) {
    throw new Error("PatronOnce didn't receive baseGuest argument");
  }

  let received = false;

  const result = {
    give(value: T) {
      if (!received) {
        received = true;
        give(value, baseGuest);
      }
      return result;
    },
    disposed(value: T | null): boolean {
      if (received) {
        return true;
      }
      const maybeDisposable = baseGuest as MaybeDisposableType;
      return maybeDisposable.disposed ? maybeDisposable.disposed(value) : false;
    },
    introduction,
  };

  return result;
};
