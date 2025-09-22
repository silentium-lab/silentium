const isDestroyable = (dep: unknown): dep is Destroyable => {
  return typeof dep === "object" && dep !== null && "destroy" in dep;
};

/**
 * Representation of Destroyable object
 */
export class Destroyable {
  public static instanceCount = 0;
  public static instancesHashMap: Record<string, number> = {};
  private theDeps: any[];
  private name: string;
  public constructor(...deps: any[]) {
    this.theDeps = deps ?? [];
    Destroyable.instanceCount += 1;
    this.name = this.constructor.name + "_" + Destroyable.instanceCount;
    Destroyable.instancesHashMap[this.name] = 1;
  }

  public destroy() {
    delete Destroyable.instancesHashMap[this.name];
    this.theDeps?.forEach((dep) => {
      if (isDestroyable(dep)) {
        dep.destroy();
      } else {
        delete Destroyable.instancesHashMap[this.name];
      }
    });
    return this;
  }

  /**
   * Add dependency what can be destroyed
   */
  public addDep(dep: any) {
    this.theDeps?.push(dep);
    return this;
  }

  public dep(dep: any) {
    this.addDep(dep);
    return dep;
  }

  public static getInstancesCount() {
    return Object.keys(Destroyable.instancesHashMap).length;
  }
}
