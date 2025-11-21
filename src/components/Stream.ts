import { ActualMessage } from "base/ActualMessage";
import { Message } from "base/Message";
import { MaybeMessage } from "types/MessageType";

/**
 * Component that receives a data array and yields values one by one
 */
export function Stream<T>(base: MaybeMessage<T[]>) {
  const $base = ActualMessage(base);
  return Message<T>((r) => {
    $base.then((v) => {
      v.forEach((cv) => {
        r(cv);
      });
    });
  });
}
