import { EventType } from "../types";

type ConstructableType = { new (...args: any[]): any };

export function ComponentClass<T extends ConstructableType>(
  classConstructor: T,
): <R = null>(
  ...args: ConstructorParameters<T>
) => R extends null ? InstanceType<T> : R extends EventType ? R : EventType<R> {
  return (...args) => new classConstructor(...args);
}
