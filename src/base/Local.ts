import { Actual } from "base/Actual";
import { Message } from "base/Message";
import { MaybeMessage } from "types/MessageType";

/**
 * Create local copy of source what can be destroyed
 */
export function Local<T>(_base: MaybeMessage<T>) {
  const $base = Actual(_base);
  return Message<T>(function LocalImpl(resolve, reject) {
    let destroyed = false;
    $base.then((v) => {
      if (!destroyed) {
        resolve(v);
      }
    });
    $base.catch(reject);
    return () => {
      destroyed = true;
    };
  });
}
