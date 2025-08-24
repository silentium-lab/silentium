import { OwnerType } from "./TheOwner";
import { TheInformation } from "./TheInformation";

type DestructorFnType = () => void;

/**
 * Information of function
 */
export class OfFunc<T> extends TheInformation<T> {
  private mbDestructor?: DestructorFnType | void;

  public constructor(
    private valueFn: (o: OwnerType<T>) => DestructorFnType | undefined | void,
  ) {
    super(valueFn);
  }

  public value(o: OwnerType<T>): this {
    this.mbDestructor = this.valueFn(o);
    return this;
  }

  public destroy(): this {
    super.destroy();
    this.mbDestructor?.();
    return this;
  }
}
