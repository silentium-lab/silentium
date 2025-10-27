import { Transport } from "../base";
import { Late } from "../components/Late";
import { Once } from "../components/Once";
import { isFilled, OwnerPool } from "../helpers";
import { EventType, TransportType, SourceType } from "../types";

/**
 * An information object that helps multiple owners access
 * a single another information object
 */
export function Shared<T>($base: EventType<T>, stateless = false) {
  return new TheShared<T>($base, stateless);
}

class TheShared<T> implements SourceType<T> {
  private ownersPool = new OwnerPool<T>();
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
      !this.ownersPool.has(transport)
    ) {
      transport.use(this.lastValue);
    }
    this.ownersPool.add(transport);
    return this;
  }

  public use(value: T) {
    this.calls.use(1);
    this.lastValue = value;
    this.ownersPool.owner().use(value);
    return this;
  }

  private firstCallTransport = Transport<T>((v: T) => {
    this.lastValue = v;
    this.ownersPool.owner().use(v);
  });

  public touched() {
    this.calls.use(1);
  }

  public pool() {
    return this.ownersPool;
  }

  public destroy() {
    return this.ownersPool.destroy();
  }
}
