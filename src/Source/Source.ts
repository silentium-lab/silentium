import { give, GuestType } from "../Guest/Guest";

export type SourceExecutorType<T> = (guest: GuestType<T>) => unknown;

export interface SourceObjectType<T> {
  value: SourceExecutorType<T>;
}

export type SourceDataType =
  | string
  | number
  | boolean
  | Date
  | object
  | Array<unknown>
  | symbol;

export type SourceType<T = any> =
  | SourceExecutorType<T>
  | SourceObjectType<T>
  | SourceDataType;

/**
 * @url https://silentium-lab.github.io/silentium/#/utils/value
 */
export function value<T>(source: SourceType<T>, guest: GuestType<T>) {
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
}

/**
 * @url https://silentium-lab.github.io/silentium/#/utils/is-source
 */
export function isSource(mbSource: any): mbSource is SourceType {
  if (typeof mbSource === "object" && typeof mbSource.value === "function") {
    return true;
  }
  return mbSource !== null && mbSource !== undefined;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/source
 */
export const source = <T>(source: SourceType<T>) => {
  if (source === undefined) {
    throw new Error("Source constructor didn't receive executor function");
  }

  return (guest: GuestType<T>) => {
    value(source, guest);
  };
};
