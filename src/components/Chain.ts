import { TapType } from "types/TapType";
import { TapParent } from "base/Tap";
import { MessageType, MessageTypeValue } from "types/MessageType";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Last<T extends readonly any[]> = T extends readonly [...infer _, infer L]
  ? L
  : never;

/**
 * Chains messages together and triggers
 * the last message only when all previous messages
 * have emitted their values. The value of Chain will be the value
 * of the last message. If any messages
 * emit a value again after the overall Chain response was already returned,
 * then Chain emits again with the value of the last message.
 */
export function Chain<T extends readonly MessageType[]>(...messages: T) {
  return new ChainImpl<T>(...messages);
}

export class ChainImpl<T extends readonly MessageType[]>
  implements MessageType<MessageTypeValue<Last<T>>>
{
  private $messages: T;
  private $latest: MessageTypeValue<Last<T>> | undefined;

  public constructor(...messages: T) {
    this.$messages = messages;
  }

  public pipe(tap: TapType<MessageTypeValue<Last<T>>>) {
    this.handleMessage(0, tap);
    return this;
  }

  private handleMessage = (index: number, tap: TapType) => {
    const message = this.$messages[index] as Last<T>;
    const next = this.$messages[index + 1] as Last<T> | undefined;
    message.pipe(this.oneMessageTap.child(tap, next, index));
  };

  private oneMessageTap = TapParent(function (
    v: MessageTypeValue<Last<T>>,
    child: ChainImpl<T>,
    next: Last<T> | undefined,
    index: number,
  ) {
    if (!next) {
      child.$latest = v as MessageTypeValue<Last<T>>;
    }
    if (child.$latest) {
      this.use(child.$latest);
    }
    if (next && !child.$latest) {
      child.handleMessage(index + 1, this);
    }
  }, this);
}
