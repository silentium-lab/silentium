import { SourceExecutorType, SourceType } from "../types/SourceType";
import { give } from "../Guest/Guest";
import { GuestType } from "../types/GuestType";

const valueExact = <T>(source: SourceType<T>, guest: GuestType<T>) => {
  if (source === undefined || source === null) {
    throw new Error("value didn't receive source argument");
  }
  if (guest === undefined || source === null) {
    throw new Error("value didn't receive guest argument");
  }
  if (typeof source === "function") {
    source(guest);
  } else if (
    typeof source === "object" &&
    "value" in source &&
    typeof source.value === "function"
  ) {
    source.value(guest);
  } else {
    give(source as T, guest);
  }

  return source;
};

/**
 * Helps to connect source and guest, if you need to get value in guest from source
 * helpful because we don't know what shape of source do we have, it can be function or object or primitive
 * @url https://silentium-lab.github.io/silentium/#/utils/value
 */
export const value = <T>(
  source: SourceType<T>,
  guest: GuestType<T> | GuestType<T>[],
) => {
  if (source === undefined || source === null) {
    throw new Error("value didn't receive source argument");
  }
  if (guest === undefined || source === null) {
    throw new Error("value didn't receive guest argument");
  }

  if (Array.isArray(guest)) {
    guest.forEach((currentGuest) => {
      valueExact(source, currentGuest);
    });
  } else {
    valueExact(source, guest);
  }

  return source;
};

/**
 * Helps to check what some information is of source shape
 * @url https://silentium-lab.github.io/silentium/#/utils/is-source
 */
export const isSource = <T>(
  mbSource: T | SourceType<T>,
): mbSource is SourceType<T> => {
  if (
    mbSource !== null &&
    typeof mbSource === "object" &&
    "value" in mbSource &&
    typeof mbSource.value === "function"
  ) {
    return true;
  }
  return mbSource !== null && mbSource !== undefined;
};

/**
 * Represents source as function
 * @url https://silentium-lab.github.io/silentium/#/source
 */
export const source = <T>(source: SourceType<T>): SourceExecutorType<T> => {
  if (source === undefined) {
    throw new Error("Source constructor didn't receive executor function");
  }

  return (guest: GuestType<T>) => {
    value(source, guest);
  };
};
