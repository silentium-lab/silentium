import { Applied } from "components/Applied";
import { ConstructorType } from "types/ConstructorType";
import { EventType } from "types/EventType";

/**
 * Allows applying variables from an event that passes an array to a function,
 * where each element of the array will be passed as a separate argument
 */
export function AppliedDestructured<const T extends any[], R>(
  $base: EventType<T>,
  applier: ConstructorType<T[number][], R>,
) {
  return Applied($base, (args) => {
    return applier(...args);
  });
}
