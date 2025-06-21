import {
  SourceDataType,
  SourceExecutorType,
  SourceType,
} from "../types/SourceType";
import { give, Guest } from "../Guest/Guest";
import { GuestType } from "../types/GuestType";

const valueExact = <T>(source: SourceType<T>, guest: GuestType<T>) => {
  if (source === undefined || source === null) {
    throw new Error("value didn't receive source argument");
  }
  if (guest === undefined || source === null) {
    throw new Error("value didn't receive guest argument");
  }
  if (typeof source === "function") {
    source(guest);
  } else if (
    typeof source === "object" &&
    "value" in source &&
    typeof source.value === "function"
  ) {
    source.value(guest);
  } else {
    give(source as T, guest);
  }

  return source;
};

/**
 * Helps to connect source and guest, if you need to get value in guest from source
 * helpful because we don't know what shape of source do we have, it can be function or object or primitive
 * @url https://silentium-lab.github.io/silentium/#/utils/value
 */
export const value = <T>(
  source: SourceType<T>,
  guest: GuestType<T> | GuestType<T>[],
) => {
  if (source === undefined || source === null) {
    throw new Error("value didn't receive source argument");
  }
  if (guest === undefined || source === null) {
    throw new Error("value didn't receive guest argument");
  }

  if (Array.isArray(guest)) {
    guest.forEach((currentGuest) => {
      valueExact(source, currentGuest);
    });
  } else {
    valueExact(source, guest);
  }

  return source;
};

/**
 * Helps to check what some information is of source shape
 * @url https://silentium-lab.github.io/silentium/#/utils/is-source
 */
export const isSource = <T>(
  mbSource: T | SourceType<T>,
): mbSource is SourceType<T> => {
  if (
    mbSource !== null &&
    typeof mbSource === "object" &&
    "value" in mbSource &&
    typeof mbSource.value === "function"
  ) {
    return true;
  }
  return mbSource !== null && mbSource !== undefined;
};

/**
 * Represents source as function
 * @url https://silentium-lab.github.io/silentium/#/source
 */
export const source = <T>(source: SourceType<T>): SourceExecutorType<T> => {
  if (source === undefined) {
    throw new Error("Source constructor didn't receive executor function");
  }

  return (guest: GuestType<T>) => {
    value(source, guest);
  };
};

type SrcExecutorType<T> = (g: Guest<T>) => () => void | undefined;
type SrcObjectType<T> = {
  value: SrcExecutorType<T>;
};

/**
 * Main information source view
 */
export class Source<T> {
  private static sourcesCounter = 0;
  private theSubSources: Source<unknown>[] = [];
  private destructor?: () => void;
  private guest?: Guest<T>;
  private executedCb?: () => void;

  public constructor(
    private src?: SrcObjectType<T> | SrcExecutorType<T> | SourceDataType<T>,
    private theName = "unknown",
  ) {
    Source.sourcesCounter += 1;
  }

  /**
   * Следующее значение источника
   */
  public next(value: T) {
    if (this.guest !== undefined) {
      this.guest.give(value);
    }
    return this;
  }

  /**
   * Ошибка в источнике
   */
  public error(cause: unknown) {
    if (this.guest !== undefined) {
      this.guest.error(cause);
    }
    return this;
  }

  /**
   * Возможность гостю получить информацию от источника
   */
  public value(guest: Guest<T>) {
    if (this.executedCb) {
      this.executedCb();
    }
    this.guest = guest;

    if (this.src === undefined) {
      return this;
    }

    if (typeof this.src === "function") {
      const mbDestructor = this.src(guest);
      if (
        mbDestructor !== undefined &&
        this.src !== mbDestructor &&
        typeof mbDestructor === "function"
      ) {
        this.destructor = mbDestructor as () => void;
      }
    } else if (
      typeof this.src === "object" &&
      this.src !== null &&
      "value" in this.src &&
      typeof this.src.value === "function"
    ) {
      this.src.value(guest);
    } else {
      this.next(this.src as T);
    }

    return this;
  }

  /**
   * Ability to destroy the information source
   */
  public destroy() {
    while (this.theSubSources.length > 0) {
      const subSource = this.theSubSources.shift();
      subSource?.destroy();
    }
    if (this.destructor) {
      this.destructor();
    }
    return this;
  }

  /**
   * The ability to link another source to the current source
   */
  public subSource(src: Source<any>) {
    this.theSubSources.push(src);
    return this;
  }

  public subSources() {
    return this.theSubSources;
  }

  public name() {
    return `#source_${this.theName}_${Source.sourcesCounter}`;
  }

  public executed(cb: () => void) {
    this.executedCb = cb;
    return this;
  }
}
