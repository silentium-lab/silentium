import { Message } from "base/Message";
import { MessageType } from "types/MessageType";

/**
 * Message what freezes first known value
 */
export function Freeze<T>($base: MessageType<T>, $invalidate?: MessageType<T>) {
  let freezedValue: T | null = null;
  return Message<T>(function FreezeImpl(resolve, reject) {
    $base.catch(reject);
    $base.then((v) => {
      if (freezedValue === null) {
        freezedValue = v;
      }
      resolve(freezedValue as T);
    });
    $invalidate?.then(() => {
      freezedValue = null;
    });
  });
}
