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
    throw new Error("value didnt receive source argument");
  }
  if (guest === undefined || source === null) {
    throw new Error("value didnt receive guest argument");
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
  if (mbSource === undefined) {
    throw new Error("isSource didnt receive mbSource argument");
  }
  return (
    typeof mbSource === "function" || typeof mbSource?.value === "function"
  );
}

/**
 * @url https://silentium-lab.github.io/silentium/#/source
 */
export class Source<T = any> implements SourceObjectType<T> {
  public constructor(private source: SourceType<T>) {
    if (source === undefined) {
      throw new Error("Source constructor didnt receive executor function");
    }
  }

  public value(guest: GuestType<T>): GuestType<T> {
    value(this.source, guest);
    return guest;
  }
}

/**
 * @url https://silentium-lab.github.io/silentium/#/utils/source-of
 */
export const sourceOf = <T>(value: T) => new Source<T>((g) => give(value, g));
