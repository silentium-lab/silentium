import { EventType } from "types/EventType";
import { Late } from "components/Late";
import { Once } from "components/Once";
import { SourceType } from "types/SourceType";
import { TransportPool } from "helpers/TransportPool";
import { TransportType } from "types/TransportType";
import { isFilled } from "helpers/guards";
import { Transport } from "base/Transport";

/**
 * An information object that helps multiple owners access
 * a single another information object
 */
export function Shared<T>($base: EventType<T>, stateless = false) {
  return new SharedEvent<T>($base, stateless);
}

export class SharedEvent<T> implements SourceType<T> {
  private transportPool = new TransportPool<T>();
  private lastValue: T | undefined;
  private calls = Late();

  public constructor(
    private $base: EventType<T>,
    private stateless = false,
  ) {
    Once(this.calls).event(
      Transport(() => {
        this.$base.event(this.firstCallTransport);
      }),
    );
  }

  public event(transport: TransportType<T>) {
    this.calls.use(1);
    if (
      !this.stateless &&
      isFilled(this.lastValue) &&
      !this.transportPool.has(transport)
    ) {
      transport.use(this.lastValue);
    }
    this.transportPool.add(transport);
    return this;
  }

  public use(value: T) {
    this.calls.use(1);
    this.lastValue = value;
    this.transportPool.transport().use(value);
    return this;
  }

  private firstCallTransport = Transport<T>((v: T) => {
    this.lastValue = v;
    this.transportPool.transport().use(v);
  });

  public touched() {
    this.calls.use(1);
  }

  public pool() {
    return this.transportPool;
  }

  public destroy() {
    return this.transportPool.destroy();
  }
}
