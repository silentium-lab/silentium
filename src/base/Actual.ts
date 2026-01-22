import { Of } from "base/Of";
import { isMessage } from "helpers/guards";
import { MaybeMessage, MessageType } from "types/MessageType";

/**
 * A function that helps to ensure that
 * the message is indeed a message object
 * and not just a value
 *
 * @url https://silentium.pw/article/actual/view
 */
export function Actual<T>(message: MaybeMessage<T>): MessageType<T> {
  return isMessage(message) ? message : Of(message);
}
