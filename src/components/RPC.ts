import { ActualMessage } from "base/ActualMessage";
import { Tap } from "base/Tap";
import { LateShared } from "components/LateShared";
import { MaybeMessage, MessageType } from "types/MessageType";
import { RPCType } from "types/RPCType";
import { TapType } from "types/TapType";

interface RPCImplType<T> {
  result(): MessageType<T>;
  error(): MessageType<Error | string>;
}

/**
 * The ability to call an external system through
 * sending a message in a standardized format
 * RPCType, the list of taps should be defined via
 * the RPC.tap object
 */
export function RPC<T>($rpc: MaybeMessage<RPCType>): RPCImplType<T> {
  return new RPCImpl(ActualMessage($rpc));
}

RPC.tap = {} as { default: TapType<RPCType> } & Record<
  string,
  TapType<RPCType>
>;

export class RPCImpl {
  private $result = LateShared();
  private $error = LateShared();

  public constructor(private $rpc: MessageType<RPCType>) {}

  public result() {
    this.$rpc.pipe(
      Tap((rpc) => {
        const tap =
          rpc.tap === undefined
            ? RPC.tap.default
            : RPC.tap[rpc.tap] || RPC.tap.default;
        if (!tap) {
          throw new Error(`RPCImpl: Tap not found ${rpc.tap}`);
        }
        if (!rpc.result) {
          rpc.result = this.$result;
        }
        if (!rpc.error) {
          rpc.error = this.$error;
        }
        tap.use(rpc);
      }),
    );
    return this.$result;
  }

  public error() {
    return this.$error;
  }
}
