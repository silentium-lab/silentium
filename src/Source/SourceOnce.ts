import { GuestType } from "../Guest/Guest";
import { value } from "./Source";
import { sourceChangeable, SourceChangeableType } from "./SourceChangeable";

/**
 * Ability to respond with value only once
 * @url https://silentium-lab.github.io/silentium/#/source/source-once
 */
export class SourceOnce<T> implements SourceChangeableType<T> {
  private source: SourceChangeableType<T>;
  private isFilled: boolean;

  public constructor(initialValue?: T) {
    this.isFilled = initialValue !== undefined;
    this.source = sourceChangeable(initialValue);
  }

  public value(guest: GuestType<T>) {
    value(this.source, guest);
    return this;
  }

  public give(value: T): this {
    if (!this.isFilled) {
      this.source.give(value);
    }
    return this;
  }
}
