import { sourceSync } from "../Source/SourceSync";
import { give, guest, GuestObjectType, GuestType } from "../Guest/Guest";
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

const sourceIsEmpty = (source: unknown) =>
  source === undefined || source === null;

/**
 * Ability to create source what can be changed later
 * @url https://silentium-lab.github.io/silentium/#/source/source-of
 */
export const sourceOf = <T>(source?: SourceType<T>) => {
  const createdSource = {} as SourceChangeableType<T>;
  const thePool = new PatronPool(createdSource);
  let isEmpty = sourceIsEmpty(source);

  if (!isEmpty && isSource(source)) {
    value(
      source,
      patronOnce((unwrappedSourceDocument) => {
        isEmpty = sourceIsEmpty(unwrappedSourceDocument);
        source = unwrappedSourceDocument as SourceDataType<T>;
      }),
    );
  }

  createdSource.value = (g: GuestType<T>) => {
    if (isEmpty) {
      if (isPatron(g)) {
        thePool.add(g);
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
    isEmpty = sourceIsEmpty(value);
    source = value as SourceDataType<T>;

    if (!isEmpty) {
      thePool.give(source);
    }

    return createdSource;
  };

  return createdSource as SourceChangeableType<T>;
};

/**
 * Changeable source what can be changed only once with specified value
 * @url https://silentium-lab.github.io/silentium/#/source/source-memo-of
 */
export const sourceMemoOf = <T>(
  source?: SourceType<T>,
): SourceChangeableType<T> => {
  const result = sourceOf(source);
  const baseSrcSync = sourceSync(result, null);

  const resultMemo = {
    value: result.value,
    give(value: T) {
      if (baseSrcSync.syncValue() !== value) {
        give(value, result.give);
      }
      return resultMemo;
    },
  };

  return resultMemo;
};
