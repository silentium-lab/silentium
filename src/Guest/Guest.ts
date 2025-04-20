import { source, SourceExecutorType, SourceType } from "../Source/Source";

type GuestIntroduction = "guest" | "patron";

export type GuestExecutorType<T = any, This = void> = (value: T) => This;

export interface GuestObjectType<T = any> {
  give(value: T): this;
  introduction?(): GuestIntroduction;
}

export type GuestType<T = any> = GuestExecutorType<T> | GuestObjectType<T>;

/**
 * @url https://silentium-lab.github.io/silentium/#/utils/give
 */
export function give<T>(
  data: T,
  guest?: GuestType<T>,
): GuestType<T> | SourceExecutorType<T> {
  if (data === undefined) {
    throw new Error("give didn't receive data argument");
  }
  if (guest === undefined) {
    return source<T>(data as SourceType<T>) as SourceExecutorType<T>;
  }
  if (typeof guest === "function") {
    guest(data);
  } else {
    guest.give(data);
  }
  return guest;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/utils/is-guest
 */
export function isGuest(mbGuest: any): mbGuest is GuestType {
  if (mbGuest === undefined) {
    throw new Error("isGuest didnt receive mbGuest argument");
  }
  return typeof mbGuest === "function" || typeof mbGuest?.give === "function";
}

/**
 * @url https://silentium-lab.github.io/silentium/#/guest
 */
export class Guest<T> implements GuestObjectType<T> {
  public constructor(private receiver: GuestExecutorType<T>) {
    if (!receiver) {
      throw new Error("reseiver function was not passed to Guest constructor");
    }
  }

  public give(value: T) {
    this.receiver(value);
    return this;
  }
}
