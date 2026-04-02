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
  return Message(function RaceImpl(resolve, reject) {
    let responded = false;
    $messages.forEach(function raceMessagesForEach($message) {
      $message.catch(reject).then(function raceMessageSub(v) {
        if (responded === false) {
          responded = true;
          resolve(v);
        }
      });
    });
  });
}
