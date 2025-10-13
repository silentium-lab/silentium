import { EventType } from "../types";

export function Of<T>(value: T): EventType<T> {
  return function OfEvent(user) {
    return user(value);
  };
}
