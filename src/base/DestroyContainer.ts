import { isDestroyable } from "helpers/guards";
import { DestroyableType } from "types/DestroyableType";

/**
 * An object that allows collecting all disposable objects and
 * disposing them later all together
 */
export function DestroyContainer() {
  return new DestroyContainerImpl();
}

export class DestroyContainerImpl implements DestroyableType {
  private destructors: DestroyableType[] = [];

  public add<R>(e: R): R {
    if (isDestroyable(e)) {
      this.destructors.push(e);
    }
    return e;
  }

  public destroy() {
    this.destructors.forEach((d) => d.destroy());
    this.destructors.length = 0;
    return this;
  }
}
