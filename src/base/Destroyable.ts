/**
 * Representation of Destroyable object
 */
export class Destroyable {
  public constructor(private deps: unknown[]) {}

  public destroy() {
    this.deps.forEach((dep) => {
      if (dep instanceof Destroyable) {
        dep.destroy();
      }
    });
    return this;
  }
}
