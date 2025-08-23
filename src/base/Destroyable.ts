const isDestroyable = (dep: unknown): dep is Destroyable => {
  return typeof dep === "object" && dep !== null && "destroy" in dep;
};

/**
 * Representation of Destroyable object
 */
export class Destroyable {
  public constructor(private deps?: unknown[]) {}

  public destroy() {
    this.deps?.forEach((dep) => {
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
    this.deps?.push(dep);
    return this;
  }
}
