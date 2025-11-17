import { SourceType } from "types/SourceType";
import { Shared } from "components/Shared";
import { TapType } from "types/TapType";

/**
 * Creates a shared source that allows multiple taps to subscribe to the same underlying source.
 * The stateless parameter controls whether the sharing maintains state or not.
 */
export function SharedSource<T>($base: SourceType<T>, stateless = false) {
  return new SharedSourceImpl<T>($base, stateless);
}

export class SharedSourceImpl<T> implements SourceType<T> {
  private $sharedBase: SourceType<T> & { touched: () => void };

  public constructor(
    private $base: SourceType<T>,
    stateless = false,
  ) {
    this.$sharedBase = Shared(this.$base, stateless);
  }

  public pipe(tap: TapType<T>) {
    this.$sharedBase.pipe(tap);
    return this;
  }

  public use(value: T) {
    this.$sharedBase.touched();
    this.$base.use(value);
    return this;
  }
}
