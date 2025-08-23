import { TheOwner } from "./TheOwner";

/**
 * Owner from function
 */
export class From<T = unknown> extends TheOwner<T> {
  public constructor(private fn: (value: T) => void) {
    super();
  }

  public give(value: T): this {
    this.fn(value);
    return this;
  }
}
