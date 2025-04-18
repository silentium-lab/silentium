import { GuestType } from "../Guest/Guest";
import { PatronPool } from "../Patron/PatronPool";
import { value } from "./Source";
import { SourceChangeable, SourceChangeableType } from "./SourceChangeable";

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-once
 */
export class SourceOnce<T> implements SourceChangeableType<T> {
  private source: SourceChangeable<T>;

  public constructor(initialValue?: T) {
    this.source = new SourceChangeable(initialValue);
  }

  public value(guest: GuestType<T>) {
    value(this.source, guest);
    return this;
  }

  public give(value: T): this {
    if (!this.source.filled()) {
      this.source.give(value);
    }
    return this;
  }

  public pool(): PatronPool<T> {
    return this.source.pool();
  }
}
