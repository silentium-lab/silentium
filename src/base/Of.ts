import { TheOwner } from "./TheOwner";
import { TheInformation } from "./TheInformation";

/**
 * Information from primitive value
 */
export class Of<T> extends TheInformation<T> {
  public constructor(private theValue: T) {
    super([theValue]);
  }

  public value(o: TheOwner<T>): this {
    o.give(this.theValue);
    return this;
  }
}
