import { Actual } from "base/Actual";
import { Message } from "base/Message";
import { MaybeMessage } from "types/MessageType";

/**
 * Component that receives a data array and yields values one by one
 */
export function Stream<T>(base: MaybeMessage<T[]>) {
  const $base = Actual(base);
  return Message<T>((resolve, reject) => {
    $base.catch(reject);
    $base.then((v) => {
      v.forEach((cv) => {
        resolve(cv);
      });
    });
  });
}
