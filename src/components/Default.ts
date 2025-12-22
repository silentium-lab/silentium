import { ActualMessage } from "base/ActualMessage";
import { Message } from "base/Message";
import { Applied } from "components/Applied";
import { Catch } from "components/Catch";
import { MaybeMessage, MessageType } from "types/MessageType";

/**
 * If base returns error then
 * default will return default value
 */
export function Default<T>(
  $base: MessageType<T>,
  _default: MaybeMessage<unknown>,
) {
  const $default = ActualMessage(_default);
  const $defaultAfterError = Applied(Catch($base), () => $default);

  return Message((resolve) => {
    $base.then(resolve);
    $defaultAfterError.then(resolve);
  });
}
