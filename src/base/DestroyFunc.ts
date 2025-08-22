import { Destroyable } from "./Destroyable";

export class DestroyFunc extends Destroyable {
  public constructor(private destructor: () => void) {
    super();
  }

  public destroy(): this {
    this.destructor();
    return this;
  }
}
