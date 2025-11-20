import { ActualMessage } from "base/ActualMessage";
import { Message } from "base/Message";
import { MaybeMessage } from "types/MessageType";

/**
 * A message that emits values received from
 * any of its bound messages
 */
export function Any<const T>(...messages: MaybeMessage<T>[]) {
  const $messages = messages.map(ActualMessage);
  return Message((r) => {
    $messages.forEach((message) => {
      message.then(r);
    });
  });
}
