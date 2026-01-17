import { Message } from "base/Message";
import { Primitive } from "components/Primitive";
import { MessageType } from "types/MessageType";

/**
 * When someone asks message for value
 * if there is no value in message return Error
 * if message exists return value
 *
 * @url https://silentium.pw/article/empty/view
 */
export function Empty<T>($base: MessageType<T>, after?: MessageType) {
  const p = Primitive($base);
  return Message<T>((resolve, reject) => {
    try {
      $base.then(resolve).catch(reject);
      if (!after) {
        p.primitiveWithException();
      }
      after?.then(() => {
        reject("Empty: no value after message!");
      });
    } catch {
      reject("Empty: no value in base message!");
    }
  });
}
