import { ActualMessage } from "base/ActualMessage";
import { Transport } from "base/Transport";
import { LateShared } from "components/LateShared";
import { MaybeMessage, MessageType } from "types/MessageType";
import { RPCType } from "types/RPCType";
import { TransportType } from "types/TransportType";

interface RPCImplType<T> {
  result(): MessageType<T>;
  error(): MessageType<Error | string>;
}

/**
 * The ability to call an external system through
 * sending a message in a standardized format
 * RPCType, the list of transports should be defined via
 * the RPC.transport object
 */
export function RPC<T>($rpc: MaybeMessage<RPCType>): RPCImplType<T> {
  return new RPCImpl(ActualMessage($rpc));
}

RPC.transport = {} as { default: TransportType<RPCType> } & Record<
  string,
  TransportType<RPCType>
>;

export class RPCImpl {
  private $result = LateShared();
  private $error = LateShared();

  public constructor(private $rpc: MessageType<RPCType>) {}

  public result() {
    this.$rpc.to(
      Transport((rpc) => {
        const transport =
          rpc.transport === undefined
            ? RPC.transport.default
            : RPC.transport[rpc.transport] || RPC.transport.default;
        if (!transport) {
          throw new Error(`RPCImpl: Transport not found ${rpc.transport}`);
        }
        if (!rpc.result) {
          rpc.result = this.$result;
        }
        if (!rpc.error) {
          rpc.error = this.$error;
        }
        transport.use(rpc);
      }),
    );
    return this.$result;
  }

  public error() {
    return this.$error;
  }
}
