import { Transport } from "../base";
import { TransportType } from "../types";

/**
 * Helps maintain an owner list allowing different
 * owners to get information from a common source
 * https://silentium-lab.github.io/silentium/#/en/utils/owner-pool
 */
export class OwnerPool<T> {
  private owners: Set<TransportType<T>>;
  private innerOwner: TransportType<T>;

  public constructor() {
    this.owners = new Set<TransportType<T>>();
    this.innerOwner = Transport((v) => {
      this.owners.forEach((g) => {
        g.use(v);
      });
    });
  }

  public owner() {
    return this.innerOwner;
  }

  public size(): number {
    return this.owners.size;
  }

  public has(owner: TransportType<T>): boolean {
    return this.owners.has(owner);
  }

  public add(owner: TransportType<T>) {
    this.owners.add(owner);
    return this;
  }

  public remove(g: TransportType<T>) {
    this.owners.delete(g);
    return this;
  }

  public destroy() {
    this.owners.forEach((g) => {
      this.remove(g);
    });
    return this;
  }
}
