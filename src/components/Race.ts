import { Actual } from "base/Actual";
import { Message } from "base/Message";
import { MaybeMessage } from "types/MessageType";

/**
 * First responded message
 *
 * @url https://silentium.pw/article/race/view
 */
export function Race<const T extends MaybeMessage[]>(...messages: T) {
  const $messages = messages.map(Actual);
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
