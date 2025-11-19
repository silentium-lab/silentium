import { isFilled } from "helpers/guards";
import { ConstructorType } from "types/ConstructorType";
import { SourceType } from "types/SourceType";

/**
 * A component that allows creating linked objects of information and its owner
 * in such a way that if a new value is assigned to the owner, this value
 * will become the value of the linked information source
 * https://silentium-lab.github.io/silentium/#/en/information/of
 */
export function Late<T>(v?: T) {
  return new LateImpl<T>(v);
}

export class LateImpl<T> implements SourceType<T> {
  private lateR: ConstructorType<[T]> | null = null;
  private notify = (v?: T) => {
    if (isFilled(v) && this.lateR) {
      this.lateR(v);
    }
  };

  public constructor(private v?: T) {}

  public then(r: ConstructorType<[T]>): this {
    if (this.lateR) {
      throw new Error(
        "Late component gets new resolver, when another was already connected!",
      );
    }
    this.lateR = r;
    this.notify(this.v);
    return this;
  }

  public use(value: T): this {
    this.notify(value);
    return this;
  }
}
