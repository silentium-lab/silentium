import { Destroyable } from "./Destroyable";
import { Of } from "./Of";
import { OwnerType } from "./TheOwner";

export interface InformationType<T = unknown> {
  value(o: OwnerType<T>): this;
}

export type MaybeInformationType<T = unknown> = InformationType<T> | T;

/**
 * Representation of Information
 */
export abstract class TheInformation<T = unknown>
  extends Destroyable
  implements InformationType<T>
{
  public abstract value(o: OwnerType<T>): this;
}

export class MbInfo<T> extends TheInformation<T> {
  private info: InformationType<T>;

  public constructor(theInfo: MaybeInformationType<T>) {
    const info =
      typeof theInfo === "object" &&
      theInfo !== null &&
      "value" in theInfo &&
      typeof theInfo.value === "function"
        ? theInfo
        : new Of(theInfo);
    super(info);
    this.info = info;
  }

  public value(o: OwnerType<T>): this {
    this.info.value(o);
    return this;
  }
}
