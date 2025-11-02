import { Transport, TransportExecutor } from "../base/Transport";
import { ensureEvent } from "../helpers/ensures";
import { EventType } from "../types/EventType";
import { TransportType } from "../types/TransportType";

type ExecutorApplier<T> = (
  executor: TransportExecutor<T>,
) => TransportExecutor<T>;

/**
 * Applies a value transfer function to the transport
 * and returns the same value transfer function for the transport
 * Useful for applying functions like debounced or throttle
 */
export function ExecutorApplied<T>(
  $base: EventType<T>,
  applier: ExecutorApplier<T>,
) {
  return new ExecutorAppliedEvent<T>($base, applier);
}

class ExecutorAppliedEvent<T> implements EventType<T> {
  public constructor(
    private $base: EventType<T>,
    private applier: ExecutorApplier<T>,
  ) {
    ensureEvent($base, "ExecutorApplied: base");
  }

  public event(transport: TransportType<T>) {
    const ExecutorAppliedBaseTransport = this.applier(
      transport.use.bind(transport),
    );
    this.$base.event(Transport(ExecutorAppliedBaseTransport));
    return this;
  }
}
