import { EventType } from "../types";

/**
 * Component that receives a data array and yields values one by one
 * https://silentium-lab.github.io/silentium/#/en/information/stream
 */
export const stream = <T>(baseEv: EventType<T[]>): EventType<T> => {
  return function StreamEvent(u) {
    baseEv(function StreamBaseUser(v) {
      v.forEach((cv) => {
        u(cv);
      });
    });
  };
};
