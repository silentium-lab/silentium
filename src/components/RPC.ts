import { Transport } from "base/Transport";
import { LateShared } from "components/LateShared";
import { EventType } from "types/EventType";
import { RPCType } from "types/RPCType";
import { TransportType } from "types/TransportType";

interface RPCImplType<T> {
  result(): EventType<T>;
  error(): EventType<Error | string>;
}

/**
 * The ability to call an external system through
 * sending a message in a standardized format
 * RPCType, the list of transports should be defined via
 * the RPC.transport object
 */
export function RPC<T>($rpc: EventType<RPCType>): RPCImplType<T> {
  return new RPCImpl($rpc);
}

RPC.transport = {} as { default: TransportType<RPCType> } & Record<
  string,
  TransportType<RPCType>
>;

export class RPCImpl {
  private $result = LateShared();
  private $error = LateShared();

  public constructor(private $rpc: EventType<RPCType>) {}

  public result() {
    this.$rpc.event(
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
