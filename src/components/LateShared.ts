import { OwnerType, SourceType, TheInformation } from "../base";
import { Late } from "../components/Late";
import { SharedSource } from "../components/SharedSource";

export class LateShared<T> extends TheInformation<T> implements SourceType<T> {
  private src: SharedSource<T>;

  public constructor(private theValue?: T) {
    super(theValue);
    this.src = new SharedSource(new Late(theValue));
  }

  public value(o: OwnerType<T>): this {
    this.src.value(o);
    return this;
  }

  public give(value: T): this {
    this.src.give(value);
    return this;
  }
}
