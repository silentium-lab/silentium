import { Destroyable } from "./Destroyable";

/**
 * Representation of destructor function as object
 */
export class DestroyFunc extends Destroyable {
  public constructor(private destructor: () => void) {
    super();
  }

  public destroy(): this {
    this.destructor();
    return this;
  }
}
