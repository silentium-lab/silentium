import { source, SourceExecutorType, SourceType } from "../Source/Source";

type GuestIntroduction = "guest" | "patron";

export type GuestExecutorType<T = any, This = void> = (value: T) => This;

export interface GuestObjectType<T = any> {
  give(value: T): this;
  introduction?(): GuestIntroduction;
}

export type GuestType<T = any> = GuestExecutorType<T> | GuestObjectType<T>;

/**
 * Helps to give data to guest, guests can be of different shapes
 * function guest or object guest
 * @url https://silentium-lab.github.io/silentium/#/utils/give
 */
export const give = <T>(
  data: T,
  guest?: GuestType<T>,
): GuestType<T> | SourceExecutorType<T> => {
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
};

/**
 * Helps to check if mbGuest can be used to retrieve value
 * @url https://silentium-lab.github.io/silentium/#/utils/is-guest
 */
export const isGuest = (mbGuest: any): mbGuest is GuestType => {
  if (mbGuest === undefined) {
    throw new Error("isGuest didnt receive mbGuest argument");
  }
  return typeof mbGuest === "function" || typeof mbGuest?.give === "function";
};

/**
 * Helps to create guest of object type
 * @url https://silentium-lab.github.io/silentium/#/guest
 */
export const guest = <T>(receiver: GuestExecutorType<T>) => {
  if (!receiver) {
    throw new Error("receiver function was not passed to Guest constructor");
  }
  const result = {
    give(value: T) {
      receiver(value);
      return result;
    },
  };
  return result;
};

/**
 * First visit of source, useful for detached sources
 * This function is important because code of source must executes
 * only after guest visited source, sources are lazy!
 * @url https://silentium-lab.github.io/silentium/#/utils/first-visit
 */
export const firstVisit = (afterFirstVisit: () => void) => {
  let isVisited = false;
  return () => {
    if (!isVisited) {
      afterFirstVisit();
    }
    isVisited = true;
  };
};
