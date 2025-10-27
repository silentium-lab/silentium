import { Shared } from "../components/Shared";
import { TransportType, SourceType } from "../types";

export function SharedSource<T>($base: SourceType<T>, stateless = false) {
  return new TheSharedSource<T>($base, stateless);
}

class TheSharedSource<T> implements SourceType<T> {
  private $sharedBase: SourceType<T> & { touched: () => void };

  public constructor(
    private $base: SourceType<T>,
    stateless = false,
  ) {
    this.$sharedBase = Shared(this.$base, stateless);
  }

  public event(transport: TransportType<T>) {
    this.$sharedBase.event(transport);
    return this;
  }

  public use(value: T) {
    this.$sharedBase.touched();
    this.$base.use(value);
    return this;
  }
}
