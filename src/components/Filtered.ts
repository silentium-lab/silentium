import { ActualMessage } from "base/ActualMessage";
import { Message } from "base/Message";
import { ConstructorType } from "types/ConstructorType";
import { MaybeMessage, MessageType } from "types/MessageType";

/**
 * Filters values from the source message based on a predicate function,
 * optionally providing a default value when the predicate fails.
 */
export function Filtered<T>(
  base: MaybeMessage<T>,
  predicate: ConstructorType<[T], boolean>,
  defaultValue?: T,
): MessageType<T> {
  const $base = ActualMessage(base);
  return Message<T>(function FilteredImpl(resolve, reject) {
    $base.catch(reject);
    $base.then((v) => {
      if (predicate(v)) {
        resolve(v);
      } else if (defaultValue !== undefined) {
        resolve(defaultValue);
      }
    });
  });
}
