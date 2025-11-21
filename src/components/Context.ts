import { ActualMessage } from "base/ActualMessage";
import { Message } from "base/Message";
import { LateShared } from "components/LateShared";
import { ConstructorType } from "types/ConstructorType";
import { ContextType } from "types/ContextType";
import { MaybeMessage } from "types/MessageType";

Context.transport = {} as { default: ConstructorType<[ContextType]> } & Record<
  string,
  ConstructorType<[ContextType]>
>;

/**
 * The ability to call an external system through
 * sending a message in a standardized format
 * RPCType, the list of taps should be defined via
 * the RPC.tap object
 */
export function Context<T>(rpc: MaybeMessage<ContextType>) {
  const $rpc = ActualMessage(rpc);
  return Message<T>((resolve, reject) => {
    const $result = LateShared<T>();
    const $error = LateShared();
    $rpc.then((rpc) => {
      const tap =
        rpc.tap === undefined
          ? Context.transport.default
          : Context.transport[rpc.tap] || Context.transport.default;
      if (!tap) {
        throw new Error(`RPCImpl: Tap not found ${rpc.tap}`);
      }
      if (!rpc.result) {
        rpc.result = $result.use.bind($result);
      }
      if (!rpc.error) {
        rpc.error = $error.use.bind($error);
      }
      tap(rpc);
    });
    $result.then(resolve);
    $error.then(reject);
  });
}
