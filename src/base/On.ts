import { EventType, EventUserType } from "../types";

/**
 * Run data with user
 */
export function On<T>(event: EventType<T>, user: EventUserType<T>) {
  return event(user);
}
