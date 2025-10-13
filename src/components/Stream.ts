import { EventType } from "../types";

/**
 * Component that receives a data array and yields values one by one
 * https://silentium-lab.github.io/silentium/#/en/information/stream
 */
export function Stream<T>(baseEv: EventType<T[]>): EventType<T> {
  return function StreamEvent(user) {
    baseEv(function StreamBaseUser(v) {
      v.forEach((cv) => {
        user(cv);
      });
    });
  };
}
