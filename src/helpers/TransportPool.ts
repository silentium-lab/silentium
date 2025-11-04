import { TransportType } from "types/TransportType";
import { Transport } from "base/Transport";
import { isDestroyed } from "helpers/guards";

/**
 * Helps maintain an owner list allowing different
 * owners to get information from a common source
 * https://silentium-lab.github.io/silentium/#/en/utils/owner-pool
 */
export class TransportPool<T> {
  private transports: Set<TransportType<T>>;
  private innerTransport: TransportType<T>;

  public constructor() {
    this.transports = new Set<TransportType<T>>();
    this.innerTransport = Transport((v) => {
      this.transports.forEach((transport) => {
        if (isDestroyed(transport) && transport.destroyed()) {
          this.transports.delete(transport);
          return;
        }
        transport.use(v);
      });
    });
  }

  public transport() {
    return this.innerTransport;
  }

  public size(): number {
    return this.transports.size;
  }

  public has(owner: TransportType<T>): boolean {
    return this.transports.has(owner);
  }

  public add(owner: TransportType<T>) {
    this.transports.add(owner);
    return this;
  }

  public remove(g: TransportType<T>) {
    this.transports.delete(g);
    return this;
  }

  public destroy() {
    this.transports.forEach((g) => {
      this.remove(g);
    });
    return this;
  }
}
