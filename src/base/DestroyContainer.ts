import { DestroyableType } from "../types/EventType";

/**
 * An object that allows collecting all disposable objects and
 * disposing them later all together
 */
export function DestroyContainer() {
  return new DestroyContainerImpl();
}

class DestroyContainerImpl implements DestroyableType {
  private destructors: DestroyableType[] = [];

  public add<R extends DestroyableType>(e: R): R {
    this.destructors.push(e);
    return e;
  }

  public destroy() {
    this.destructors.forEach((d) => d.destroy());
    return this;
  }
}
