import { EventType } from "../types";

/**
 * A component that takes one value at a time and returns
 * an array of all previous values
 * https://silentium-lab.github.io/silentium/#/en/information/sequence
 */
export function Sequence<T>(baseEv: EventType<T>): EventType<T[]> {
  return function SequenceEvent(user) {
    const result: T[] = [];
    baseEv(function SequenceBaseUser(v) {
      result.push(v);
      user(result);
    });
  };
}
