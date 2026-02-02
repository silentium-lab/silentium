import { Message } from "base/Message";
import { isDestroyable } from "helpers/guards";
import { MessageType } from "types/MessageType";

/**
 * Ability to create new messages when they will be needed
 *
 * @url https://silentium.pw/article/lazy/view
 */
export function Lazy<T>(constructor: () => MessageType<T>) {
  return Message<T>((resolve, reject) => {
    const inst = constructor();
    inst.catch(reject).then(resolve);
    return () => {
      if (isDestroyable(inst)) {
        inst.destroy();
      }
    };
  });
}
