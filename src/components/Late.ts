import { SourceType } from "types/SourceType";
import { isFilled } from "helpers/guards";
import { TapType } from "types/TapType";

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
  private lateTap: TapType<T> | null = null;
  private notify = (v?: T) => {
    if (isFilled(v) && this.lateTap) {
      this.lateTap.use(v);
    }
  };

  public constructor(private v?: T) {}

  public pipe(tap: TapType<T>): this {
    if (this.lateTap) {
      throw new Error(
        "Late component gets new tap, when another was already connected!",
      );
    }
    this.lateTap = tap;
    this.notify(this.v);
    return this;
  }

  public use(value: T): this {
    this.notify(value);
    return this;
  }
}
