const isDestroyable = (dep: unknown): dep is Destroyable => {
  return typeof dep === "object" && dep !== null && "destroy" in dep;
};

/**
 * Representation of Destroyable object
 */
export class Destroyable {
  private theDeps: unknown[];
  public constructor(...deps: unknown[]) {
    this.theDeps = deps ?? [];
  }

  public destroy() {
    this.theDeps?.forEach((dep) => {
      if (isDestroyable(dep)) {
        dep.destroy();
      }
    });
    return this;
  }

  /**
   * Add dependency what can be destroyed
   */
  public addDep(dep: unknown) {
    this.theDeps?.push(dep);
    return this;
  }
}
