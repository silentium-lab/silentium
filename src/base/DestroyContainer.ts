import { Destroyable } from "base/Destroyable";
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
  private _destroyed = false;

  /**
   * Add one destroyable
   * @param e
   * @returns
   */
  public add<R>(e: R): R {
    this.destructors.push(Destroyable(e));
    return e;
  }

  /**
   * Add many destroyable objects
   * @param destroyableList
   * @returns
   */
  public many(destroyableList: unknown[]) {
    destroyableList.forEach((d) => {
      this.add(d);
    });
    return this;
  }

  public destroy() {
    this._destroyed = true;
    this.destructors.forEach((d) => d.destroy());
    this.destructors.length = 0;
    return this;
  }

  public destroyed() {
    return this._destroyed;
  }

  public destructor() {
    return this.destroy.bind(this);
  }
}
