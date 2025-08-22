import { TheOwner } from "./TheOwner";
import { TheInformation } from "./TheInformation";
import { isFilled } from "src/helpers";

/**
 * Information from primitive value
 */
export class Of<T> extends TheInformation<T> {
  public constructor(private theValue: T) {
    super([theValue]);
  }

  public value(o: TheOwner<T>): this {
    if (isFilled(this.theValue)) {
      o.give(this.theValue);
    }
    return this;
  }
}
