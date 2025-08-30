import { Shared } from "../components/Shared";
import { InformationType, OwnerType, TheInformation } from "../base";

export class SharedSource<T> extends TheInformation<T> implements OwnerType<T> {
  private sharedSrc: Shared<T>;

  public constructor(
    private baseSrc: InformationType<T>,
    stateless = false,
  ) {
    const sharedSrc = new Shared(baseSrc, stateless);
    super(sharedSrc);
    this.sharedSrc = sharedSrc;
  }

  public value(o: OwnerType<T>): this {
    this.sharedSrc.value(o);
    return this;
  }

  public give(value: T): this {
    this.sharedSrc.pool().owner().give(value);
    return this;
  }
}
