import { ActualMessage } from "base/ActualMessage";
import { Message } from "base/Message";
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
  const $messages = messages.map(ActualMessage);
  return Message<MessageTypeValue<Last<T>>>(function ChainImpl(r) {
    let $latest: MessageTypeValue<Last<T>> | undefined;
    const handleMessage = (index: number) => {
      const message = $messages[index] as Last<T>;
      const next = $messages[index + 1] as Last<T> | undefined;
      message.then((v) => {
        oneMessage(v as MessageTypeValue<Last<T>>, next, index);
      });
    };
    function oneMessage(
      v: MessageTypeValue<Last<T>>,
      next: Last<T> | undefined,
      index: number,
    ) {
      if (!next) {
        $latest = v as MessageTypeValue<Last<T>>;
      }
      if ($latest) {
        r($latest);
      }
      if (next && !$latest) {
        handleMessage(index + 1);
      }
    }
    handleMessage(0);
  });
}
