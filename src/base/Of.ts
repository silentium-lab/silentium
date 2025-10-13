import { EventType } from "../types";

export function Of<T>(value: T): EventType<T> {
  return function OfEvent(u) {
    return u(value);
  };
}
