import { Message } from "base/Message";
import { MessageType } from "types/MessageType";

/**
 * Creates a sequence that accumulates all values from the source into an array,
 * emitting the growing array with each new value.
 */
export function Sequence<T>($base: MessageType<T>) {
  return Message<T[]>((r) => {
    const result: T[] = [];
    $base.then((v) => {
      result.push(v);
      r(result);
    });
  });
}
