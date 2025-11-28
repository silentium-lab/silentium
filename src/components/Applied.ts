import { ActualMessage } from "base/ActualMessage";
import { Message } from "base/Message";
import { ConstructorType } from "types/ConstructorType";
import { MaybeMessage } from "types/MessageType";

/**
 * An message that applies a function
 * to the value of the base message
 */
export function Applied<const T, R>(
  base: MaybeMessage<T>,
  applier: ConstructorType<[T], R>,
) {
  const $base = ActualMessage(base);
  return Message<R>(function AppliedImpl(resolve, reject) {
    $base.catch(reject);
    $base.then((v) => {
      resolve(applier(v));
    });
  });
}
