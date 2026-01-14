import { Applied } from "components/Applied";
import { ConstructorType } from "types/ConstructorType";
import { MaybeMessage } from "types/MessageType";

/**
 * Allows applying variables from an message that passes an array to a function,
 * where each element of the array will be passed as a separate argument
 *
 * @url https://silentium.pw/article/applied-destructured/view
 */
export function Destructured<const T extends any[], R>(
  $base: MaybeMessage<T>,
  applier: ConstructorType<any[], R>,
) {
  return Applied($base, function DestructuredImpl(args) {
    return applier(...args);
  });
}
