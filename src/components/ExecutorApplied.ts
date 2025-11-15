import { Transport, TransportExecutor } from "base/Transport";
import { ensureMessage } from "helpers/ensures";
import { MessageType } from "types/MessageType";
import { TransportType } from "types/TransportType";

type ExecutorApplier<T> = (
  executor: TransportExecutor<T>,
) => TransportExecutor<T>;

/**
 * Applies a value transfer function to the transport
 * and returns the same value transfer function for the transport
 * Useful for applying functions like debounced or throttle
 */
export function ExecutorApplied<T>(
  $base: MessageType<T>,
  applier: ExecutorApplier<T>,
) {
  return new ExecutorAppliedImpl<T>($base, applier);
}

export class ExecutorAppliedImpl<T> implements MessageType<T> {
  public constructor(
    private $base: MessageType<T>,
    private applier: ExecutorApplier<T>,
  ) {
    ensureMessage($base, "ExecutorApplied: base");
  }

  public to(transport: TransportType<T>) {
    const ExecutorAppliedBaseTransport = this.applier(
      transport.use.bind(transport),
    );
    this.$base.to(Transport(ExecutorAppliedBaseTransport));
    return this;
  }
}
