import { Rejections } from "base/Rejections";
import { isFilled } from "helpers/guards";
import { ConstructorType } from "types/ConstructorType";
import { MessageSourceType } from "types/SourceType";

/**
 * A component that allows creating linked objects of information and its owner
 * in such a way that if a new value is assigned to the owner, this value
 * will become the value of the linked information source
 * https://silentium-lab.github.io/silentium/#/en/information/of
 */
export function Late<T>(v?: T) {
  return new LateImpl<T>(v);
}

export class LateImpl<T> implements MessageSourceType<T> {
  private rejections = new Rejections();
  private lateR: ConstructorType<[T]> | null = null;
  private notify = () => {
    if (isFilled(this.v) && this.lateR) {
      try {
        this.lateR(this.v);
      } catch (e: any) {
        this.rejections.reject(e);
      }
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
    this.notify();
    return this;
  }

  public use(value: T): this {
    this.v = value;
    this.notify();
    return this;
  }

  public catch(rejected: ConstructorType<[unknown]>) {
    this.rejections.catch(rejected);
    return this;
  }
}
