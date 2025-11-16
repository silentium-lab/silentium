import { Applied } from "components/Applied";
import { ConstructorType } from "types/ConstructorType";
import { MaybeMessage } from "types/MessageType";

/**
 * Allows applying variables from an message that passes an array to a function,
 * where each element of the array will be passed as a separate argument
 */
export function AppliedDestructured<const T extends any[], R>(
  $base: MaybeMessage<T>,
  applier: ConstructorType<T[number][], R>,
) {
  return Applied($base, (args) => {
    return applier(...args);
  });
}
