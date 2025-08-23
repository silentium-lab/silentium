import { From, TheOwner } from "../base";

/**
 * Helps maintain an owner list allowing different
 * owners to get information from a common source
 * https://silentium-lab.github.io/silentium/#/en/utils/owner-pool
 */
export class OwnerPool<T> {
  private owners: Set<TheOwner<T>>;
  private innerOwner: TheOwner<T>;

  public constructor() {
    this.owners = new Set<TheOwner<T>>();
    this.innerOwner = new From((v) => {
      this.owners.forEach((g) => {
        g.give(v);
      });
    });
  }

  public owner() {
    return this.innerOwner;
  }

  public size(): number {
    return this.owners.size;
  }

  public has(owner: TheOwner<T>): boolean {
    return this.owners.has(owner);
  }

  public add(owner: TheOwner<T>) {
    this.owners.add(owner);
    return this;
  }

  public remove(g: TheOwner<T>) {
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
