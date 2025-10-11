import { EventType, EventUserType } from "../types";

/**
 * Run data with user
 */
export const on = <T>(event: EventType<T>, user: EventUserType<T>) =>
  event(user);
