import { give, GuestType } from "../Guest/Guest";

export type SourceExecutorType<T> = (guest: GuestType<T>) => unknown;

export interface SourceObjectType<T> {
  value: SourceExecutorType<T>;
}

export type SourceDataType<T> = Extract<
  T,
  string | number | boolean | Date | object | Array<unknown> | symbol
>;

export type SourceType<T = any> =
  | SourceExecutorType<T>
  | SourceObjectType<T>
  | SourceDataType<T>;

/**
 * Helps to connect source and guest, if you need to get value in guest from source
 * helpful because we don't know what shape of source do we have, it can be function or object or primitive
 * @url https://silentium-lab.github.io/silentium/#/utils/value
 */
export const value = <T>(source: SourceType<T>, guest: GuestType<T>) => {
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
 * Helps to check what some information is of source shape
 * @url https://silentium-lab.github.io/silentium/#/utils/is-source
 */
export const isSource = (mbSource: any): mbSource is SourceType => {
  if (typeof mbSource === "object" && typeof mbSource.value === "function") {
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
