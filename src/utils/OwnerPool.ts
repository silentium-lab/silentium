import { Owner } from "../Owner";

export class OwnerPool<T> {
  private owners: Set<Owner<T>>;
  private innerOwner: Owner<T>;

  public constructor() {
    this.owners = new Set<Owner<T>>();
    this.innerOwner = new Owner(
      (v) => {
        this.owners.forEach((g) => {
          g.give(v);
        });
      },
      (cause) => {
        this.owners.forEach((g) => {
          g.error(cause);
        });
      },
    );
  }

  public owner() {
    return this.innerOwner;
  }

  public size(): number {
    return this.owners.size;
  }

  public has(owner: Owner<T>): boolean {
    return this.owners.has(owner);
  }

  public add(shouldBePatron: Owner<T>) {
    this.owners.add(shouldBePatron);
    return this;
  }

  public remove(g: Owner<T>) {
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
