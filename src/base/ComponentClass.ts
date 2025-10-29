import {
  DestroyableType,
  EventType,
  EventTypeValue,
  SourceType,
} from "../types";

type ConstructableType = { new (...args: any[]): any };

export function ComponentClass<T extends ConstructableType>(
  classConstructor: T,
): <R = null>(
  ...args: ConstructorParameters<T>
) => R extends null
  ? ConstructorParameters<T>[0] extends EventType
    ? InstanceType<T> extends SourceType
      ? InstanceType<T> extends DestroyableType
        ? SourceType<EventTypeValue<ConstructorParameters<T>[0]>> &
            DestroyableType
        : SourceType<EventTypeValue<ConstructorParameters<T>[0]>>
      : InstanceType<T> extends DestroyableType
        ? EventType<EventTypeValue<ConstructorParameters<T>[0]>> &
            DestroyableType
        : EventType<EventTypeValue<ConstructorParameters<T>[0]>>
    : InstanceType<T>
  : R extends EventType
    ? R
    : EventType<R> {
  return (...args) => new classConstructor(...args);
}
