import { EventUserType } from "./EventUserType";

export interface EventType<T = unknown> {
  event(user: EventUserType<T>): this;
}

export interface DestroyableType {
  destroy(): this;
}

export function isDestroyable<T extends object>(
  o: T,
): o is T & DestroyableType {
  return "destroy" in o && typeof (o as any).destroy === "function";
}

export type EventTypeValue<T> = T extends EventType<infer U> ? U : never;
