import { EventUserType } from "../types";

/**
 * Helps maintain an owner list allowing different
 * owners to get information from a common source
 * https://silentium-lab.github.io/silentium/#/en/utils/owner-pool
 */
export class OwnerPool<T> {
  private owners: Set<EventUserType<T>>;
  private innerOwner: EventUserType<T>;

  public constructor() {
    this.owners = new Set<EventUserType<T>>();
    this.innerOwner = (v) => {
      this.owners.forEach((g) => {
        g(v);
      });
    };
  }

  public owner() {
    return this.innerOwner;
  }

  public size(): number {
    return this.owners.size;
  }

  public has(owner: EventUserType<T>): boolean {
    return this.owners.has(owner);
  }

  public add(owner: EventUserType<T>) {
    this.owners.add(owner);
    return this;
  }

  public remove(g: EventUserType<T>) {
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
