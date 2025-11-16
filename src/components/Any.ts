import { ActualMessage } from "base/ActualMessage";
import { ensureMessage } from "helpers/ensures";
import { MaybeMessage, MessageType } from "types/MessageType";
import { TransportType } from "types/TransportType";

/**
 * A message that emits values received from
 * any of its bound messages
 */
export function Any<const T>(...messages: MaybeMessage<T>[]) {
  return new AnyImpl<T>(...messages.map(ActualMessage));
}

export class AnyImpl<T> implements MessageType<T> {
  private $messages: MessageType<T>[];

  public constructor(...messages: MessageType<T>[]) {
    this.$messages = messages;
  }

  public to(transport: TransportType<T>): this {
    this.$messages.forEach((message) => {
      ensureMessage(message, "Any: item");
      message.to(transport);
    });
    return this;
  }
}
