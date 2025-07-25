import { OwnerType } from "../types";

/**
 * Helps maintain an owner list allowing different
 * owners to get information from a common source
 * https://silentium-lab.github.io/silentium/#/en/utils/owner-pool
 */
export class OwnerPool<T> {
  private owners: Set<OwnerType<T>>;
  private innerOwner: OwnerType<T>;

  public constructor() {
    this.owners = new Set<OwnerType<T>>();
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

  public has(owner: OwnerType<T>): boolean {
    return this.owners.has(owner);
  }

  public add(shouldBePatron: OwnerType<T>) {
    this.owners.add(shouldBePatron);
    return this;
  }

  public remove(g: OwnerType<T>) {
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
