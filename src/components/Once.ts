import { Message } from "base/Message";
import { MessageType } from "types/MessageType";

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 */
export function Once<T>($base: MessageType<T>) {
  return Message<T>((r) => {
    let isFilled = false;
    $base.then((v) => {
      if (!isFilled) {
        isFilled = true;
        r(v);
      }
    });
  });
}
