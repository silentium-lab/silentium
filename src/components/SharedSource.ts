import { SourceType } from "types/SourceType";
import { Shared } from "components/Shared";
import { TransportType } from "types/TransportType";

/**
 * Creates a shared source that allows multiple transports to subscribe to the same underlying source.
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

  public to(transport: TransportType<T>) {
    this.$sharedBase.to(transport);
    return this;
  }

  public use(value: T) {
    this.$sharedBase.touched();
    this.$base.use(value);
    return this;
  }
}
