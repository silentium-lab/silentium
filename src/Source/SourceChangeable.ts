import { Guest, GuestObjectType, GuestType } from "../Guest/Guest";
import { isSource, SourceObjectType, SourceType, value } from "./Source";
import { PatronPool } from "../Patron/PatronPool";
import { isPatron } from "../Patron/Patron";
import { PatronOnce } from "../Patron/PatronOnce";

export interface PoolAwareType<T = any> {
  pool(): PatronPool<T>;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-changeable
 */
export type SourceChangeableType<T = any> = SourceObjectType<T> &
  GuestObjectType<T> &
  PoolAwareType<T>;

export class SourceChangeable<T> implements SourceChangeableType<T> {
  private thePool = new PatronPool(this);
  private theEmptyPool = new PatronPool(this);
  private isEmpty: boolean;
  private sourceDocument?: T;

  public constructor(sourceDocument?: T | SourceType<T>) {
    this.isEmpty = sourceDocument === undefined;

    if (sourceDocument !== undefined && isSource(sourceDocument)) {
      value(
        sourceDocument,
        new PatronOnce((unwrappedSourceDocument) => {
          this.isEmpty = unwrappedSourceDocument === undefined;
          this.sourceDocument = unwrappedSourceDocument;
        }),
      );
    } else {
      this.isEmpty = sourceDocument === undefined;
      this.sourceDocument = sourceDocument;
    }
  }

  public pool() {
    return this.thePool;
  }

  public give(value: T): this {
    this.isEmpty = false;
    this.sourceDocument = value;
    this.thePool.give(this.sourceDocument);
    this.theEmptyPool.give(this.sourceDocument);
    return this;
  }

  public value(guest: GuestType<T>): this {
    if (this.isEmpty) {
      if (isPatron(guest)) {
        this.theEmptyPool.add(guest);
      }
      return this;
    }

    if (typeof guest === "function") {
      this.thePool.distribute(this.sourceDocument, new Guest(guest));
    } else {
      this.thePool.distribute(this.sourceDocument, guest);
    }

    return this;
  }

  public filled() {
    return !this.isEmpty;
  }
}
