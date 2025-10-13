import { EventType, ConstructorType } from "../types";

/**
 * Constructor with applied function to its results
 */
export function ConstructorApplied<T>(
  baseConstructor: ConstructorType<any[], EventType>,
  applier: (i: EventType) => EventType<T>,
): ConstructorType<EventType[], EventType<T>> {
  return function LazyAppliedData(...args) {
    return applier(baseConstructor(...args));
  };
}
