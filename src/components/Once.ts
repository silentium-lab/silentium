import { Message } from "base/Message";
import { MessageType } from "types/MessageType";

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 *
 * @url https://silentium.pw/article/once/view
 */
export function Once<T>($base: MessageType<T>) {
  return Message<T>((resolve, reject) => {
    let isFilled = false;
    $base.catch(reject);
    $base.then((v) => {
      if (!isFilled) {
        isFilled = true;
        resolve(v);
      }
    });
  });
}
