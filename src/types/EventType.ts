import { EventUserType } from "./EventUserType";

export interface EventType<T = unknown> {
  event(user: EventUserType<T>): this;
}

export interface DestroyableType {
  destroy(): this;
}

export type EventTypeValue<T> = T extends EventType<infer U> ? U : never;
