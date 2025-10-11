import { EventType } from "../types";

export const of = <T>(value: T): EventType<T> =>
  function OfEvent(u) {
    return u(value);
  };
