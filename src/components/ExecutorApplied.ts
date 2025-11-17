import { Tap, TapExecutor } from "base/Tap";
import { ensureMessage } from "helpers/ensures";
import { MessageType } from "types/MessageType";
import { TapType } from "types/TapType";

type ExecutorApplier<T> = (executor: TapExecutor<T>) => TapExecutor<T>;

/**
 * Applies a value transfer function to the tap
 * and returns the same value transfer function for the tap
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

  public pipe(tap: TapType<T>) {
    this.$base.pipe(Tap(this.applier(tap.use.bind(tap))));
    return this;
  }
}
