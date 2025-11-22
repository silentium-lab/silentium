import { ActualMessage } from "base/ActualMessage";
import { Message } from "base/Message";
import { ConstructorType } from "types/ConstructorType";
import { ContextType } from "types/ContextType";
import { MaybeMessage } from "types/MessageType";

Context.transport = new Map<any, ConstructorType<[ContextType]>>();

/**
 * The ability to call an external system through
 * sending a message in a standardized format
 * ContextType, the list of transport should be defined via
 * the Context.transport map object
 */
export function Context<T>(msg: MaybeMessage<ContextType>) {
  const $msg = ActualMessage(msg);
  return Message<T>((resolve, reject) => {
    $msg.then((message) => {
      const transport = Context.transport.get(message.transport);
      if (transport === undefined) {
        throw new Error(`Context: unknown transport ${message.transport}`);
      }
      if (!message.result) {
        message.result = resolve;
      }
      if (!message.error) {
        message.error = reject;
      }
      try {
        transport(message);
      } catch (error) {
        reject(error);
      }
    });
  });
}
