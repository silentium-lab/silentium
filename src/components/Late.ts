import { From, OwnerType, TheInformation } from "../base";
import { isFilled } from "../helpers";

/**
 * A component that allows creating linked objects of information and its owner
 * in such a way that if a new value is assigned to the owner, this value
 * will become the value of the linked information source
 * https://silentium-lab.github.io/silentium/#/en/information/of
 */
export class Late<T> extends TheInformation<T> {
  private theOwner?: OwnerType<T>;
  private lateOwner = new From((v: T) => {
    this.theValue = v;
    this.notify();
  });

  public constructor(private theValue?: T) {
    super(theValue);
  }

  public value(o: OwnerType<T>): this {
    if (this.theOwner) {
      throw new Error(
        "Late component gets new owner, when another was already connected!",
      );
    }
    this.theOwner = o;
    this.notify();
    return this;
  }

  public owner() {
    return this.lateOwner;
  }

  private notify() {
    if (isFilled(this.theValue) && this.theOwner) {
      this.theOwner.give(this.theValue);
    }
    return this;
  }
}
