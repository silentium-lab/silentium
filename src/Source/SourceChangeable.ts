import { Guest, GuestObjectType, GuestType } from "../Guest/Guest";
import { isSource, SourceObjectType, SourceType, value } from "./Source";
import { PatronPool } from "../Patron/PatronPool";
import { isPatron } from "../Patron/Patron";
import { PatronOnce } from "../Patron/PatronOnce";

export type SourceChangeableType<T = any> = SourceObjectType<T> &
  GuestObjectType<T>;

/**
 * Ability to create source what can be changed later
 * @url https://silentium-lab.github.io/silentium/#/source/source-changeable
 */
export const sourceChangeable = <T>(source?: SourceType<T> | T) => {
  const createdSource = {} as SourceChangeableType<T>;
  const thePool = new PatronPool(createdSource);
  const theEmptyPool = new PatronPool(createdSource);
  let isEmpty = source === undefined;

  if (source !== undefined && isSource(source)) {
    value(
      source,
      new PatronOnce((unwrappedSourceDocument) => {
        isEmpty = unwrappedSourceDocument === undefined;
        source = unwrappedSourceDocument;
      }),
    );
  } else {
    isEmpty = source === undefined;
  }

  createdSource.value = (guest: GuestType<T>) => {
    if (isEmpty) {
      if (isPatron(guest)) {
        theEmptyPool.add(guest);
      }
      return createdSource;
    }

    if (typeof guest === "function") {
      thePool.distribute(source, new Guest(guest));
    } else {
      thePool.distribute(source, guest);
    }

    return createdSource;
  };

  createdSource.give = (value: T) => {
    isEmpty = false;
    source = value;
    thePool.give(source);
    theEmptyPool.give(source);
    return createdSource;
  };

  return createdSource;
};
