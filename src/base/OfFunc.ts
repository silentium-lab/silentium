import { TheOwner } from "./TheOwner";
import { TheInformation } from "./TheInformation";

type DestructorFnType = () => void;

/**
 * Information of function
 */
export class OfFunc<T> extends TheInformation<T> {
  private mbDestructor?: DestructorFnType;

  public constructor(
    private valueFn: (o: TheOwner<T>) => DestructorFnType | undefined,
  ) {
    super([valueFn]);
  }

  public value(o: TheOwner<T>): this {
    this.mbDestructor = this.valueFn(o);
    return this;
  }

  public destroy(): this {
    super.destroy();
    this.mbDestructor?.();
    return this;
  }
}
