import { ActualMessage } from "base/ActualMessage";
import { Message } from "base/Message";
import { MaybeMessage } from "types/MessageType";

/**
 * A message that emits values received from
 * any of its bound messages
 *
 * @url https://silentium.pw/article/any-component/view
 */
export function Any<const T>(...messages: MaybeMessage<T>[]) {
  const $messages = messages.map(ActualMessage);
  return Message<T>(function AnyImpl(resolve, reject) {
    $messages.forEach((message) => {
      message.catch(reject);
      message.then(resolve);
    });
  });
}
