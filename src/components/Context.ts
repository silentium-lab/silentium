import { Actual } from "base/ActualMessage";
import { Source } from "base/MessageSource";
import { All } from "components/All";
import { Destructured } from "components/AppliedDestructured";
import { Primitive } from "components/Primitive";
import { ConstructorType } from "types/ConstructorType";
import { ContextType } from "types/ContextType";
import { MaybeMessage } from "types/MessageType";

Context.transport = new Map<any, ConstructorType<[ContextType]>>();

/**
 * The ability to call an external system through
 * sending a message in a standardized format
 * ContextType, the list of transport should be defined via
 * the Context.transport map object
 *
 * @url https://silentium.pw/article/context/view
 */
export function Context<T>(
  name: MaybeMessage<string | symbol>,
  params: MaybeMessage<ContextType["params"]> = {},
) {
  const $msg = Destructured(
    All(Actual(name), Actual(params)),
    (name, params) =>
      ({
        transport: name,
        params,
        result: undefined,
        error: undefined,
      }) as ContextType,
  );
  return Source<T>(
    (resolve, reject) => {
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
    },
    (value) => {
      const msg = Primitive($msg).primitive();
      if (msg === null) {
        throw new Error("Context: sourcing impossible message not existed");
      }
      const transport = Context.transport.get(msg.transport);
      if (transport === undefined) {
        throw new Error(`Context: sourcing unknown transport ${msg.transport}`);
      }
      transport({
        ...msg,
        value,
      });
    },
  );
}
