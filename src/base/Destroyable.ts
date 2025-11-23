import { isDestroyable } from "helpers/guards";
import { DestroyableType } from "types/DestroyableType";

/**
 * Allows creating an object that definitely has a destructor,
 * useful to avoid creating unnecessary conditions
 */
export function Destroyable<T>(base: T) {
  return new DestroyableImpl(base);
}

export class DestroyableImpl<T> implements DestroyableType {
  public constructor(private base: T) {}

  public destroy(): this {
    if (isDestroyable(this.base)) {
      this.base.destroy();
    }

    if (typeof this.base === "function") {
      this.base();
    }

    return this;
  }
}
