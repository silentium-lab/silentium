import { Destroyable } from "./Destroyable";
import { TheOwner } from "./TheOwner";

/**
 * Representation of Information
 */
export abstract class TheInformation<T = unknown> extends Destroyable {
  public abstract value(o: TheOwner<T>): this;
}
