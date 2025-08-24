import { Destroyable } from "./Destroyable";
import { OwnerType } from "./TheOwner";

export interface InformationType<T = unknown> {
  value(o: OwnerType<T>): this;
}

/**
 * Representation of Information
 */
export abstract class TheInformation<T = unknown>
  extends Destroyable
  implements InformationType<T>
{
  public abstract value(o: OwnerType<T>): this;
}
