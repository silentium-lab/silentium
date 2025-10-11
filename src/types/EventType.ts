import { EventUserType as EventUserType } from "./EventUserType";

export type DestructorType = () => void;
export type EventType<T = unknown> = (
  user: EventUserType<T>,
) => DestructorType | void;

type ExcludeVoidFromReturnType<F extends (...args: any[]) => any> = F extends (
  ...args: infer Args
) => infer Return
  ? (...args: Args) => Exclude<Return, void>
  : never;

export type EventTypeDestroyable<T = unknown> = ExcludeVoidFromReturnType<
  EventType<T>
>;

export interface DestroyableType {
  destroy: DestructorType;
}

export type EventTypeValue<T> = T extends EventType<infer U> ? U : never;
