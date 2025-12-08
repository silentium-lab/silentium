import { ActualMessage } from "base/ActualMessage";
import { Message } from "base/Message";
import { MaybeMessage } from "types/MessageType";

/**
 * First responded message
 */
export function Race<const T extends MaybeMessage[]>(...messages: T) {
  const $messages = messages.map(ActualMessage);
  return Message((resolve, reject) => {
    let responded = false;
    $messages.forEach(($message) => {
      $message.catch(reject).then((v) => {
        if (responded === false) {
          responded = true;
          resolve(v);
        }
      });
    });
  });
}
