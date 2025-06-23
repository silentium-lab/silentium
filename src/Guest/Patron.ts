import { GuestType } from "../types/GuestType";
import { give } from "./Guest";
import { GuestDisposableType } from "./GuestDisposable";

/**
 * @deprecated will be removed
 */
export type PatronType<T> = GuestDisposableType<T> & {
  // TODO remove
  introduction(): "patron";
};

/**
 * Patron may have priority information
 * @url https://silentium-lab.github.io/silentium/#/en/terminology/priority
 * @deprecated will be removed
 */
export interface PatronWithPriority {
  // TODO remove
  priority(): number;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/en/utils/patron-priority
 * @deprecated will be removed
 */
export const patronPriority = (g: GuestType | PatronWithPriority) => {
  // TODO remove
  let priority = 100;

  if ("priority" in g && typeof g.priority === "function") {
    priority = g.priority();
  }

  return priority;
};

/**
 * Helps to check what incoming object is patron
 * @url https://silentium-lab.github.io/silentium/#/utils/is-patron
 * @deprecated will be removed
 */
export const isPatron = (guest: GuestType): guest is PatronType<unknown> =>
  typeof guest === "object" &&
  guest !== null &&
  guest?.introduction?.() === "patron"; // TODO remove

/**
 * @deprecated will be removed
 */
export const introduction = () => "patron" as const; // TODO remove

/**
 * Help to turn existed guest intro patron
 * @url https://silentium-lab.github.io/silentium/#/patron
 * @deprecated will be removed
 */
export const patron = <T>(
  willBePatron: GuestType<T>,
): GuestDisposableType<T> => {
  // TODO remove
  if (willBePatron === undefined) {
    throw new Error("Patron didn't receive willBePatron argument");
  }

  const result = {
    give(value: T) {
      give(value, willBePatron);
      return result;
    },
    disposed(value: T | null): boolean {
      const maybeDisposable = willBePatron as GuestDisposableType;
      return maybeDisposable?.disposed?.(value) || false;
    },
    introduction,
  };

  return result;
};

/**
 * System patron with higher priority than regular patron
 * @deprecated will be removed
 */
export const systemPatron = <T>(
  willBePatron: GuestType<T>,
): GuestDisposableType<T> & PatronWithPriority => {
  // TODO remove
  const p = patron(willBePatron);

  return {
    ...p,
    priority: () => 200,
  } as GuestDisposableType<T> & PatronWithPriority;
};

/**
 * Set priority on existed patron
 * @deprecated will be removed
 */
export const withPriority = <T extends PatronType<unknown>>( // TODO remove
  patron: T,
  priority: number,
): T & PatronWithPriority => {
  return {
    ...patron,
    priority: () => priority,
  };
};
