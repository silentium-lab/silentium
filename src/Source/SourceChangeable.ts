import { guest, GuestObjectType, GuestType } from "../Guest/Guest";
import { isPatron } from "../Patron/Patron";
import { patronOnce } from "../Patron/PatronOnce";
import { PatronPool } from "../Patron/PatronPool";
import {
  isSource,
  SourceDataType,
  SourceObjectType,
  SourceType,
  value,
} from "./Source";

export type SourceChangeableType<T = any> = SourceObjectType<T> &
  GuestObjectType<T>;

type ExpandLiteralTypes<T> = T extends number
  ? number
  : T extends string
    ? string
    : T extends boolean
      ? boolean
      : T;

/**
 * Ability to create source what can be changed later
 * @url https://silentium-lab.github.io/silentium/#/source/source-changeable
 */
export const sourceChangeable = <T>(source?: SourceType<T>) => {
  const createdSource = {} as SourceChangeableType<T>;
  const thePool = new PatronPool(createdSource);
  const theEmptyPool = new PatronPool(createdSource);
  let isEmpty = source === undefined;

  if (source !== undefined && isSource(source)) {
    value(
      source,
      patronOnce((unwrappedSourceDocument) => {
        isEmpty = unwrappedSourceDocument === undefined;
        source = unwrappedSourceDocument as SourceDataType<T>;
      }),
    );
  } else {
    isEmpty = source === undefined;
  }

  createdSource.value = (g: GuestType<T>) => {
    if (isEmpty) {
      if (isPatron(g)) {
        theEmptyPool.add(g);
      }
      return createdSource;
    }

    if (typeof g === "function") {
      thePool.distribute(source, guest(g));
    } else {
      thePool.distribute(source, g);
    }

    return createdSource;
  };

  createdSource.give = (value: T) => {
    isEmpty = false;
    source = value as SourceDataType<T>;
    thePool.give(source);
    theEmptyPool.give(source);
    return createdSource;
  };

  return createdSource as SourceChangeableType<ExpandLiteralTypes<T>>;
};
